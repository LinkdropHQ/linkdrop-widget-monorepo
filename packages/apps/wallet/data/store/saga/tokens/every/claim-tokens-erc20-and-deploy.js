import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import { factory } from 'app.config.js'
import { getEns } from 'helpers'

const generator = function * ({ payload }) {
  try {
    const { tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropModuleAddress, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const chainId = yield select(generator.selectors.chainId)
    const email = yield select(generator.selectors.email)
    const privateKey = yield select(generator.selectors.privateKey)
    const result = yield sdk.claimAndCreateP2P({
      weiAmount: weiAmount || '0',
      tokenAddress,
      email,
      tokenAmount: tokenAmount || '0',
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      factoryAddress: factory,
      privateKey,
      ensName: getEns({ email, chainId }),
      saltNonce: String(+(new Date())),
      gasPrice: '0'
    })

    // {
    //   owner: new ethers.Wallet(privateKey).address, +
    //   ensName: динамически создать на основе имейла, +
    //   saltNonce: String(+(new Date())),
    //   gasPrice: "0",
    // }

    const { success, errors, txHash } = result
    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (errors.length > 0) {
        const currentError = ERRORS.indexOf(errors[0])
        yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    console.error(error)
    const { response: { data: { errors = [] } = {} } = {} } = error
    if (errors.length > 0) {
      const currentError = ERRORS.indexOf(errors[0])
      yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
    }
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  chainId: ({ user: { chainId } }) => chainId,
  email: ({ user: { email } }) => email,
  ens: ({ user: { ens } }) => ens,
  privateKey: ({ user: { privateKey } }) => privateKey
}
