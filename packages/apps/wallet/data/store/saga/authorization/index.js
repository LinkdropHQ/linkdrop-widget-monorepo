import { takeEvery } from 'redux-saga/effects'

import checkEmail from './every/check-email'
import signUp from './every/sign-up'
import signIn from './every/sign-in'
import enableGDrivePermissions from './every/enable-gdrive-permissions'
import syncDataWithDrive from './every/sync-data-with-drive'
import getEmailAndAvatar from './every/get-email-and-avatar'
import signInWithGoogle from './every/sign-in-with-google'

export default function * () {
  yield takeEvery('*AUTHORIZATION.CHECK_EMAIL', checkEmail)
  yield takeEvery('*AUTHORIZATION.SIGN_UP', signUp)
  yield takeEvery('*AUTHORIZATION.SIGN_IN', signIn)
  yield takeEvery('*AUTHORIZATION.ENABLE_GDRIVE_PERMISSIONS', enableGDrivePermissions)
  yield takeEvery('*AUTHORIZATION.SYNC_DATA_WITH_DRIVE', syncDataWithDrive)
  yield takeEvery('*AUTHORIZATION.GET_EMAIL_AND_AVATAR', getEmailAndAvatar)
  yield takeEvery('*AUTHORIZATION.SIGN_IN_WITH_GOOGLE', signInWithGoogle)
}
