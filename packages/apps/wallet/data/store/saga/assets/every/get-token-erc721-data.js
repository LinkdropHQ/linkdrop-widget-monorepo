import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from '@linkdrop/commons'
import getAssetImage from './get-asset-image'
import getAssetMetadataURL from './get-asset-metadata-url'
import getAssetSymbol from './get-asset-symbol'

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId } = payload
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

    const newAssetToClaim = {
      balanceFormatted: null,
      balance: null,
      tokenAddress: nftAddress,
      icon: image,
      image,
      symbol,
      tokenId,
      name: symbol,
      decimals: null,
      type: 'erc721',
      price: 0
    }

    const assetsUpdated = assetsToClaim.concat([newAssetToClaim])
    yield put({ type: 'ASSETS.SET_ITEMS_TO_CLAIM', payload: { itemsToClaim: assetsUpdated } })
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
