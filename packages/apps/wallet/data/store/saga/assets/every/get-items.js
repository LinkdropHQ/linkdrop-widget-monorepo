import { put, call, all, select } from 'redux-saga/effects'
import { getAssetPrice, getItemsERC721, getItemsTrustwallet } from 'data/api/assets'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from '@linkdrop/commons'
import getAssetImage from './get-asset-image'
import getAssetMetadataURL from './get-asset-metadata-url'
import { prepareAssetFormat } from './helpers'

const getTokenDataERC20 = function * ({ address, symbol, decimals, chainId, provider, wallet }) {
  const assetPrice = yield getAssetPrice({ symbol, chainId })
  const tokenContract = new ethers.Contract(address, TokenMock.abi, provider)
  const balance = yield tokenContract.balanceOf(wallet)
  const amountFormatted = yield utils.formatUnits(balance, decimals)
  return prepareAssetFormat({
    balanceFormatted: Number(amountFormatted),
    balance,
    address,
    symbol,
    decimals,
    type: 'erc20',
    price: assetPrice
  })
}

const getTokenDataERC721 = function * ({ wallet, tokenId, name, address, chainId, provider }) {
  const nftContract = yield new ethers.Contract(address, NFTMock.abi, provider)
  const ownerOfToken = yield nftContract.ownerOf(tokenId)
  if (!ownerOfToken || wallet.toUpperCase() !== ownerOfToken.toUpperCase()) { return }
  const metadataURL = yield getAssetMetadataURL({ tokenId, nftContract })
  const symbol = yield nftContract.symbol()
  let image
  if (metadataURL !== '') {
    image = yield getAssetImage({ metadataURL })
  }
  return prepareAssetFormat({
    address,
    symbol,
    tokenId,
    image,
    type: 'erc721'
  })
}

const generator = function * () {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const wallet = yield select(generator.selectors.wallet)

    if (!wallet) {
      return
    }
    const networkName = defineNetworkName({ chainId })
    const { assets: resultERC721 } = yield call(getItemsERC721, { address: wallet, networkName })
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethBalance = yield provider.getBalance(wallet)
    let assetsStorage = []
    if (Number(chainId) === '1') {
      const { total, docs } = yield call(getItemsTrustwallet, { wallet })
      if (total && total > 0) {
        const erc20AssetsFormatted = yield all(docs.map(({ contract: { address, symbol, decimals } }) => getTokenDataERC20({ address, symbol, decimals, chainId, provider, wallet })))
        assetsStorage = assetsStorage.concat(erc20AssetsFormatted)
      }
    }

    if (resultERC721 && resultERC721.length > 0) {
      const erc721AssetsFormatted = yield all(resultERC721.map(({ token_id: tokenId, asset_contract: { address }, name }) => getTokenDataERC721({ tokenId, name, address, chainId, provider, wallet })))
      assetsStorage = assetsStorage.concat(erc721AssetsFormatted.filter(asset => asset))
    }

    if (ethBalance && ethBalance > 0) {
      let assetPrice = 0
      if (Number(chainId) === 1) {
        assetPrice = yield call(getAssetPrice, { symbol: 'ETH' })
      }
      const amountFormatted = utils.formatUnits(ethBalance, 18)
      assetsStorage = assetsStorage.concat(prepareAssetFormat({
        balanceFormatted: Number(amountFormatted),
        balance: ethBalance,
        address: ethers.constants.AddressZero,
        symbol: 'ETH',
        decimals: 18,
        type: 'erc20',
        price: assetPrice
      }))
    }
    yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assetsStorage || [] } })
  } catch (error) {
    const items = yield select(generator.selectors.items)
    yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: items || [] } })
    console.error(error)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  wallet: ({ user: { wallet } }) => wallet,
  items: ({ assets: { items } }) => items
}
