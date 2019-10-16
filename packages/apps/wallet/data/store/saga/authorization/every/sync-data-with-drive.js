import { put, select } from 'redux-saga/effects'
import gapiService from 'data/api/google-api'
import getImageAndAvatar from './get-email-and-avatar'
import { generateRandomPassword } from 'helpers'

const generator = function * () {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const { chainId } = yield select(generator.selectors.userData)
    const sdk = yield select(generator.selectors.sdk)
    const { email, avatar } = yield getImageAndAvatar()
    // fetching files from Drive
    const fetchResult = yield gapiService.fetchFiles({ chainId })
    let data
    if (fetchResult.success && fetchResult.data[`_${chainId}`]) {
      data = fetchResult.data[`_${chainId}`]
    } else { // if no files on drive upload new ones
      const password = generateRandomPassword()
      // console.log({ password, apiHost })
      console.log('registering...')
      const { success, data: requestData } = yield sdk.register(email, password)
      if (success) {
        const { privateKey, sessionKeyStore } = requestData
        // save private key in non-persistent JS memory (not in localstorage)
        // save sessionKeyStore to persistent localstorage
        const uploadResult = yield gapiService.uploadFiles({ chainId, privateKey, sessionKeyStore })
        data = uploadResult.data
      }
    }
    const { privateKey, sessionKeyStore } = data
    yield put({ type: '*USER.SET_USER_DATA', payload: { privateKey, sessionKeyStore, avatar, chainId } })
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
    return { email, avatar }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  userData: ({ user: { chainId } }) => ({ chainId }),
  sdk: ({ user: { sdk } }) => sdk
}
