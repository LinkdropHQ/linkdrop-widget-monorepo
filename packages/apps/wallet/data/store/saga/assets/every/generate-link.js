import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId } = payload
    const sdk = yield select(generator.selectors.sdk)
    const privateKey = yield select(generator.selectors.privateKey)
    const owner = new ethers.Wallet(privateKey).address
    const safe = sdk.precomputeAddress({ owner })
    const linkdropModuleAddress = sdk.precomputeLinkdropModuleAddress(owner, safe)

    const { url } = yield sdk.generateLinkERC721({
      signingKeyOrWallet: privateKey,
      linkdropModuleAddress: linkdropModuleAddress,
      weiAmount: 0,
      nftAddress: nftAddress,
      tokenId: tokenId,
      expirationTime: 1900000000000
    })

    if (url) {
      yield put({ type: 'ASSETS.SET_LINK', payload: { link: url } })
    } else {
      alert('come error occured with sdk method generateLinkERC721')
    }

    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    console.error({ error })
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
  }
}

export default generator
generator.selectors = {
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  sdk: ({ user: { sdk } }) => sdk,
  chainId: ({ user: { chainId } }) => chainId,
  privateKey: ({ user: { privateKey } }) => privateKey,
  wallet: ({ user: { wallet } }) => wallet,
  items: ({ assets: { items } }) => items
}
