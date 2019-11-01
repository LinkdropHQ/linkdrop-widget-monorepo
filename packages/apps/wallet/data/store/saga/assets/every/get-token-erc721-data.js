import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from '@linkdrop/commons'
import getAssetImage from './get-asset-image'
import getAssetMetadataURL from './get-asset-metadata-url'
import getAssetSymbol from './get-asset-symbol'
import { prepareAssetFormat } from './helpers'
import getEthData from './get-eth-data'

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId, weiAmount } = payload
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const metadataURL = yield getAssetMetadataURL({ tokenId, nftContract })
    const symbol = yield getAssetSymbol({ contract: nftContract, tokenAddress: nftAddress })
    const assetsToClaim = yield select(generator.selectors.itemsToClaim)
    if (metadataURL !== '') {
      image = yield getAssetImage({ metadataURL })
    }

    const newAssetToClaim = prepareAssetFormat({
      address: nftAddress,
      symbol,
      image,
      tokenId,
      type: 'erc721'
    })

    const assetsUpdated = assetsToClaim.concat(newAssetToClaim)
    yield put({ type: 'ASSETS.SET_ITEMS_TO_CLAIM', payload: { itemsToClaim: assetsUpdated } })
    if (weiAmount) {
      yield getEthData({ payload: { weiAmount } })
    }
    const updatedAssetsToClaim = yield select(generator.selectors.itemsToClaim)
    console.log({ updatedAssetsToClaim })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
generator.selectors = {
  itemsToClaim: ({ assets: { itemsToClaim } }) => itemsToClaim,
  chainId: ({ user: { chainId } }) => chainId
}
