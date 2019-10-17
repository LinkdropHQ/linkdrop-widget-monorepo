import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import { factory } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { tokenType } = payload
    const email = yield select(generator.selectors.email)
    const sdk = yield select(generator.selectors.sdk)
    const { isDeployed, safe } = yield sdk.isDeployed(email)
    if (isDeployed) {
      if (tokenType === 'erc20') {
        yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { ...payload, wallet: safe } })
      }

      if (tokenType === 'erc721') {
        yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { ...payload, wallet: safe } })
      }
    } else {
      if (tokenType === 'erc20') {
        yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC20_AND_DEPLOY', payload: { ...payload, email } })
      }

      if (tokenType === 'erc721') {
        yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC721_AND_DEPLOY', payload: { ...payload, email } })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  email: ({ user: { email } }) => email
}
