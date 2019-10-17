/* global gapi */
import { put } from 'redux-saga/effects'
import config from 'app.config.js'

const generator = function * () {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const authInstance = yield gapi.auth2.getAuthInstance()
    const isSignedIn = yield authInstance.isSignedIn.get()
    if (!isSignedIn) {
      throw new Error('User not signed in')
    }
    const user = yield authInstance.currentUser.get()
    const options = yield new gapi.auth2.SigninOptionsBuilder({ scope: config.authScopeDrive })
    const result = yield user.grant(options)
    if (result) {
      yield put({ type: '*AUTHORIZATION.SYNC_DATA_WITH_DRIVE' })
    }
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
