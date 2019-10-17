/* global gapi */
import { put, select } from 'redux-saga/effects'
import { removeUserData } from 'helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const chainId = yield select(generator.selectors.chainId)
    const auth2 = gapi.auth2.getAuthInstance()
    const signOut = new Promise((resolve, reject) => {
      auth2.signOut().then(function () {
        return resolve(true)
      })
    })
    const result = yield signOut
    if (result) {
      removeUserData({ chainId })
      yield put({ type: '*USER.SET_USER_DATA', payload: { privateKey: null, email: null, sessionKeyStore: null, chainId } })
      yield put({ type: 'AUTHORIZATION.SET_AUTHORIZED', payload: { authorized: false } })
      yield put({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen: 'initial' } })
      yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  sdk: ({ user: { sdk } }) => sdk
}
