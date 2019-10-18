import { put, select } from 'redux-saga/effects'
import { saveUserData } from 'helpers'
import { ethers } from 'ethers'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { privateKey, sessionKeyStore, avatar, chainId, email } = payload
    let wallet = null
    if (privateKey) {
      const sdk = yield select(generator.selectors.sdk)
      const owner = new ethers.Wallet(privateKey).address
      wallet = sdk.precomputeAddress({ owner })
    }

    yield put({ type: 'USER.SET_USER_DATA', payload: { wallet, privateKey, sessionKeyStore, avatar, email } })
    if (ls && ls.setItem) {
      saveUserData({ sessionKeyStore, avatar, chainId, email })
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
