import { takeEvery } from 'redux-saga/effects'

import createSdk from './every/create-sdk'
import setUserData from './every/set-user-data'
import fetchPK from './every/fetch-pk'

export default function * () {
  yield takeEvery('*USER.CREATE_SDK', createSdk)
  yield takeEvery('*USER.SET_USER_DATA', setUserData)
  yield takeEvery('*USER.FETCH_PK', fetchPK)
}
