import { put } from 'redux-saga/effects'
import { saveUserData } from 'helpers'

const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { privateKey, sessionKeyStore, avatar, chainId, email } = payload
    yield put({ type: 'USER.SET_USER_DATA', payload: { privateKey, sessionKeyStore, avatar, email } })
    if (ls && ls.setItem) {
      saveUserData({ sessionKeyStore, avatar, chainId, email })
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
