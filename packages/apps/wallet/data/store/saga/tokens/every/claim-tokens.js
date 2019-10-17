import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import { factory } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { tokenType } = payload
    const email = yield select(generator.selectors.email)
    const sdk = yield select(generator.selectors.sdk)
    console.log('here')
    const isDeployed = yield sdk.isDeployed('spacehaz@gmail.com')
    console.log({ isDeployed })
  } catch (error) {
    console.error(error)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  email: ({ user: { email } }) => email
}
