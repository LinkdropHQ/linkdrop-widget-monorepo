import { put, call, select } from 'redux-saga/effects'
import { getERC721TokenData } from 'data/api/tokens'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from '@linkdrop/commons'

const getImage = function * ({ metadataURL }) {
  try {
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return data.image
  } catch (error) {
    return ''
  }
}

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId } = payload
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const metadataURL = yield nftContract.tokenURI(tokenId)
    const name = yield nftContract.symbol()
    const assetsToClaim = yield select(generator.selectors.itemsToClaim)

    if (metadataURL !== '') {
      // strip 'ipfs://' from hash
      image = yield getImage({ metadataURL })
    }

    const newAssetToClaim = {
      balanceFormatted: null,
      balance: null,
      tokenAddress: nftAddress,
      icon: image,
      image,
      symbol: name,
      name,
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
    const chainId = yield select(generator.selectors.chainId)
    const { nftAddress } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    // const name = yield nftContract.name()
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
