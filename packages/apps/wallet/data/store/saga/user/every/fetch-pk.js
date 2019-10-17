import { select } from 'redux-saga/effects'

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
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  sessionKeyStore: ({ user: { sessionKeyStore } }) => sessionKeyStore
}
