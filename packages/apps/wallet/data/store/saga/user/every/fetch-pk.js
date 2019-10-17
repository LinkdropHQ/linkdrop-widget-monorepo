import { put, select } from 'redux-saga/effects'
import { initializeWalletSdk } from 'data/sdk'
import config from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const sessionKeyStore = yield select(generator.selectors.sessionKeyStore)
    console.log({ sessionKeyStore })
    if (!sessionKeyStore) { return false }
    const pk = yield sdk.extractPrivateKeyFromSession(sessionKeyStore)
    console.log({ pk })
    return pk
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  sessionKeyStore: ({ user: { sessionKeyStore } }) => sessionKeyStore
}
