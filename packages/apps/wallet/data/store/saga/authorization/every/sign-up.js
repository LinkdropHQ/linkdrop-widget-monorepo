import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const { email, password } = payload
    const chainId = yield select(generator.selectors.chainId)
    const sdk = yield select(generator.selectors.sdk)
    const { success, data: requestData } = yield sdk.register(email, password)
    if (success) {
      const { privateKey, sessionKeyStore } = requestData
      yield put({ type: '*USER.SET_USER_DATA', payload: { privateKey, email, sessionKeyStore, chainId } })
      yield put({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen: 'success' } })
    }
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  sdk: ({ user: { sdk } }) => sdk
}
