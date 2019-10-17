import { put, call, select } from 'redux-saga/effects'
import { checkEmail } from 'data/api/authorization'

const generator = function * ({ payload }) {
  try {
    const { email } = payload
    const chainId = yield select(generator.selectors.chainId)
    yield put({ type: 'AUTHORIZATION.SET_LOADING', payload: { loading: true } })
    const wasCreatedPreviously = yield call(checkEmail, { email, chainId })
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
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
