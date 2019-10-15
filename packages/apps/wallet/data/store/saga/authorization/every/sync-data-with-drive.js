import { put, select } from 'redux-saga/effects'
import gapiService from 'data/api/google-api'
import { getEns } from 'helpers'
import getImageAndAvatar from './get-email-and-avatar'

const generator = function * () {
  try {
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const { chainId } = yield select(generator.selectors.userData)
    const { email, avatar } = yield getImageAndAvatar()
    // fetching files from Drive
    const fetchResult = yield gapiService.fetchFiles({ chainId })
    let data
    if (fetchResult.success && fetchResult.data[`_${chainId}`]) {
      data = fetchResult.data[`_${chainId}`]
    } else { // if no files on drive upload new ones
      const { contractAddress, privateKey } = yield select(generator.selectors.userData)
      const ens = getEns({ email, chainId })
      const uploadResult = yield gapiService.uploadFiles({ chainId, ens, contractAddress, privateKey })
      data = uploadResult.data
    }
    const { privateKey, contractAddress, ens } = data
    console.log({ privateKey, contractAddress, ens, avatar, chainId })
    yield put({ type: '*USER.SET_USER_DATA', payload: { privateKey, contractAddress, ens, avatar, chainId } })
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
    return { email, avatar }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  userData: ({ user: { chainId, contractAddress, privateKey } }) => ({ chainId, contractAddress, privateKey })
}
