import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const sdk = yield select(generator.selectors.sdk)
    yield put({
      type: 'USER.SET_READY_TO_CLAIM',
      payload: {
        readyToClaim: false
      }
    })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { linkdropModuleAddress, linkKey } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const linkWallet = yield new ethers.Wallet(linkKey, provider)
    const linkId = yield linkWallet.address
    const claimed = yield sdk.isClaimedLink({ linkdropModule: linkdropModuleAddress, linkId })
    yield put({
      type: 'USER.SET_ALREADY_CLAIMED',
      payload: { alreadyClaimed: claimed }
    })
    yield put({
      type: 'USER.SET_READY_TO_CLAIM',
      payload: { readyToClaim: true }
    })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  sdk: ({ user: { sdk } }) => sdk
}
