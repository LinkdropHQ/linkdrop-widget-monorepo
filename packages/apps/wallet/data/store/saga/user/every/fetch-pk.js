import { select, put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const sessionKeyStore = yield select(generator.selectors.sessionKeyStore)
    if (!sessionKeyStore) { return false }
    const { privateKey, success } = yield sdk.extractPrivateKeyFromSession(sessionKeyStore)
    if (success && privateKey) {
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
    } else {
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey: false } })
    }
  } catch (e) {
    yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey: false } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  sessionKeyStore: ({ user: { sessionKeyStore } }) => sessionKeyStore
}
