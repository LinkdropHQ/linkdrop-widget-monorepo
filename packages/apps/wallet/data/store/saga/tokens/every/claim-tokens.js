import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import { factory } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { tokenType, email } = payload
    const sdk = yield select(generator.selectors.sdk)
    const isDeployed = yield sdk.isDeployed('spacehaz@gmail.com')
    console.log({ isDeployed })
  } catch (error) {
    console.error(error)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
