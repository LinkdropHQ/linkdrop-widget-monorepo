import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import TokenMock from 'contracts/TokenMock.json'
import getAssetDecimals from './get-asset-decimals'
import getAssetSymbol from './get-asset-symbol'
import getAssetPrice from './get-asset-price'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { tokenAmount, tokenAddress } = payload
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const contract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const decimals = yield getAssetDecimals({ contract, tokenAddress })
    const symbol = yield getAssetSymbol({ contract, tokenAddress })
    const icon = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress.toLowerCase()}/logo.png`
    const assetPrice = yield getAssetPrice({ symbol, chainId })
    const amountBigNumber = utils.formatUnits(tokenAmount, decimals)
    const assetsToClaim = yield select(generator.selectors.itemsToClaim)
    const newAssetToClaim = {
      balanceFormatted: Number(amountBigNumber),
      balance: tokenAmount,
      tokenAddress,
      icon,
      symbol,
      decimals,
      type: 'erc20',
      price: assetPrice
    }
    const assetsUpdated = assetsToClaim.concat([newAssetToClaim])
    yield put({ type: 'ASSETS.SET_ITEMS_TO_CLAIM', payload: { itemsToClaim: assetsUpdated } })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
  itemsToClaim: ({ assets: { itemsToClaim } }) => itemsToClaim,
  chainId: ({ user: { chainId } }) => chainId
}
