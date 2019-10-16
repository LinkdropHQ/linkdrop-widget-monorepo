import { put, call } from 'redux-saga/effects'
import { checkEmail } from 'data/api/authorization'

const generator = function * ({ payload }) {
  try {
    const { email } = payload
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const wasCreatedPreviously = yield call(checkEmail, { email })
    if (wasCreatedPreviously) {
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
