/* global gapi */
import { put } from 'redux-saga/effects'
import gapiService from 'data/api/google-api'
import syncDataWithDrive from './sync-data-with-drive'

const generator = function * () {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const isSignedIn = yield gapiService.signIn()
    if (isSignedIn) {
      // if has drive permissions sync with it immediately
      console.log(isSignedIn, gapiService.hasDrivePermissions())
      if (gapiService.hasDrivePermissions()) {
        yield syncDataWithDrive()
      } else {
        // otherwise show screen to enable permissions
        yield put({ type: 'AUTHORIZATION.SET_AUTHORIZED', payload: { authorized: true } })
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
