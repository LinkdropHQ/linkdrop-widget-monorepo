import { select, put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { removeUserData } from 'helpers'
import config from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const sessionKeyStore = yield select(generator.selectors.sessionKeyStore)
    if (!sessionKeyStore) { return false }
    const { privateKey, success } = yield sdk.extractPrivateKeyFromSession(sessionKeyStore)
    if (success && privateKey) {
      const sdk = yield select(generator.selectors.sdk)
      const owner = new ethers.Wallet(privateKey).address
      const wallet = sdk.precomputeAddress({ owner })
      yield put({ type: 'USER.SET_WALLET', payload: { wallet } })
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
    } else {
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey: false } })
    }
  } catch (e) {
    const chainId = yield select(generator.selectors.chainId)
    removeUserData({ chainId: chainId || config.defaultChainId })
    yield put({ type: '*USER.SET_USER_DATA', payload: { privateKey: null, email: null, sessionKeyStore: null, chainId } })
    yield put({ type: 'AUTHORIZATION.SET_AUTHORIZED', payload: { authorized: false } })
    yield put({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen: 'initial' } })
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  chainId: ({ user: { chainId } }) => chainId,
  sessionKeyStore: ({ user: { sessionKeyStore } }) => sessionKeyStore
}
