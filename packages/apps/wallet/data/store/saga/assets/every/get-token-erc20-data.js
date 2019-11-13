import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import TokenMock from 'contracts/TokenMock.json'
import getAssetDecimals from './get-asset-decimals'
import getAssetSymbol from './get-asset-symbol'
import getAssetPrice from './get-asset-price'
import { prepareAssetFormat } from './helpers'
import getEthData from './get-eth-data'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { tokenAmount, tokenAddress, weiAmount } = payload
    console.log({ tokenAmount, tokenAddress, weiAmount })
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const assetsToClaim = yield select(generator.selectors.itemsToClaim)
    let newAssetToClaim
    if (tokenAddress === ethers.constants.AddressZero) {
      const contract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      const decimals = 18
      const symbol = 'ETH'
      const assetPrice = yield getAssetPrice({ symbol, chainId })
      const amountBigNumber = utils.formatUnits(weiAmount, decimals)
      newAssetToClaim = prepareAssetFormat({
        balanceFormatted: Number(amountBigNumber),
        balance: tokenAmount,
        address: tokenAddress,
        symbol,
        decimals,
        type: 'erc20',
        price: assetPrice
      })
    } else {
      const contract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      const decimals = yield getAssetDecimals({ contract, tokenAddress })
      const symbol = yield getAssetSymbol({ contract, tokenAddress })
      const assetPrice = yield getAssetPrice({ symbol, chainId })
      const amountBigNumber = utils.formatUnits(tokenAmount, decimals)
      newAssetToClaim = prepareAssetFormat({
        balanceFormatted: Number(amountBigNumber),
        balance: tokenAmount,
        address: tokenAddress,
        symbol,
        decimals,
        type: 'erc20',
        price: assetPrice
      })
    }

    const assetsUpdated = assetsToClaim.concat(newAssetToClaim)
    yield put({ type: 'ASSETS.SET_ITEMS_TO_CLAIM', payload: { itemsToClaim: assetsUpdated } })
    if (weiAmount) {
      yield getEthData({ payload: { weiAmount } })
    }
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
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
