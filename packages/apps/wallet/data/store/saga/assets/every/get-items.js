import { put, call, all, select } from 'redux-saga/effects'
import { getItems, getAssetPrice, getItemsERC721 } from 'data/api/assets'
import { ethers, utils } from 'ethers'
import { getERC721TokenData } from 'data/api/tokens'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from '@linkdrop/commons'
import { getImages } from 'helpers'

const getImage = function * ({ metadataURL }) {
  try {
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return data.image
  } catch (error) {
    return ''
  }
}

const getTokenDataERC20 = function * ({ address, symbol, decimals, chainId, provider, wallet }) {
  let assetPrice = 0
  if (Number(chainId) === 1) {
    assetPrice = yield call(getAssetPrice, { symbol })
  }

  const tokenContract = new ethers.Contract(address, TokenMock.abi, provider)

  const balance = yield tokenContract.balanceOf(wallet)
  // currentAddress - кошелек пользователя
  // account
  const amountFormatted = yield utils.formatUnits(balance, decimals)
  // const assetsToClaim = select(generator.selectors.itemsToClaim)
  return {
    balanceFormatted: Number(amountFormatted),
    balance,
    tokenAddress: address,
    icon: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address.toLowerCase()}/logo.png`,
    symbol,
    decimals,
    type: 'erc20',
    price: assetPrice
  }
}

const getTokenDataERC721 = function * ({ tokenId, name, address, chainId, provider }) {
  const nftContract = yield new ethers.Contract(address, NFTMock.abi, provider)
  const metadataURL = yield nftContract.tokenURI(tokenId)
  const symbol = yield nftContract.symbol()
  let image
  if (metadataURL !== '') {
    image = yield getImage({ metadataURL })
  }
  return {
    tokenId,
    name,
    tokenAddress: address,
    symbol,
    image,
    type: 'erc721'
  }
}

const generator = function * () {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const wallet = yield select(generator.selectors.wallet)
    if (!wallet) {
      return
    }
    const networkName = defineNetworkName({ chainId })

    const { status = 0, result = [], message } = yield call(getItems, { address: wallet, networkName })
    const { assets: resultERC721 } = yield call(getItemsERC721, { address: wallet, networkName })
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethBalance = yield provider.getBalance(wallet)

    let assetsStorage = []
    if (status && status === '1' && message === 'OK') {
      const erc20Assets = result.filter(asset => asset.type === 'ERC-20')
      const erc20AssetsFormatted = yield all(erc20Assets.map(({ contractAddress: address, symbol, decimals }) => getTokenDataERC20({ address, symbol, decimals, chainId, provider, wallet })))
      assetsStorage = assetsStorage.concat(erc20AssetsFormatted)
    }

    if (resultERC721 && resultERC721.length > 0) {
      const erc721AssetsFormatted = yield all(resultERC721.map(({ token_id: tokenId, asset_contract: { address }, name }) => getTokenDataERC721({ tokenId, name, address, chainId, provider, wallet })))
      assetsStorage = assetsStorage.concat(erc721AssetsFormatted)
    }

    if (ethBalance && ethBalance > 0) {
      let assetPrice = 0
      if (Number(chainId) === 1) {
        assetPrice = yield call(getAssetPrice, { symbol: 'ETH' })
      }
      const amountFormatted = utils.formatUnits(ethBalance, 18)
      assetsStorage = assetsStorage.concat([{
        balanceFormatted: Number(amountFormatted),
        balance: ethBalance,
        tokenAddress: ethers.constants.AddressZero,
        symbol: 'ETH',
        decimals: 18,
        type: 'erc20',
        icon: getImages({ src: 'ether' }).image,
        price: assetPrice
      }])
    }
    yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assetsStorage || [] } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  sdk: ({ user: { sdk } }) => sdk,
  chainId: ({ user: { chainId } }) => chainId,
  privateKey: ({ user: { privateKey } }) => privateKey,
  wallet: ({ user: { wallet } }) => wallet
}
