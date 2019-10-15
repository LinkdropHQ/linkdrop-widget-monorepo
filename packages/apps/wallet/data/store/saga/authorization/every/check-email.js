import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    const { email } = payload
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    yield delay(3000)
    if (DB.indexOf(email) > -1) {
      yield put({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen: 'sign-in' } })
    } else {
      yield put({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen: 'sign-up' } })
    }
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

const DB = [
  'spacehaz@gmail.com',
  'spacehaz2@gmail.com'
]
