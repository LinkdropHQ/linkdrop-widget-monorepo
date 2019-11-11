import { put } from 'redux-saga/effects'
import gapiService from 'data/api/google-api'
import syncDataWithDrive from './sync-data-with-drive'

const generator = function * () {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const isSignedIn = yield gapiService.signIn()
    if (isSignedIn) {
      // if has drive permissions sync with it immediately
      if (gapiService.hasDrivePermissions()) {
        yield syncDataWithDrive()
      } else {
        // otherwise show screen to enable permissions
        yield put({ type: 'AUTHORIZATION.SET_AUTHORIZED', payload: { authorized: true } })
      }
    }
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
