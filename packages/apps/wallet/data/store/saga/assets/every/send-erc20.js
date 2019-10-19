import { defineNetworkName } from '@linkdrop/commons'
import { put, select } from 'redux-saga/effects'
import TokenMock from 'contracts/TokenMock.json'
import { utils, ethers } from 'ethers'
import { convertEns } from './helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    const { to, amount, tokenAddress, decimals } = payload
    const chainId = yield select(generator.selectors.chainId)
    let address = to
    const sdk = yield select(generator.selectors.sdk)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    if (to.indexOf('.') > -1) {
      address = yield convertEns({ ens: to, provider })
    }
    if (!address) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      return yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['ENS_INVALID'] } })
    }

    const privateKey = yield select(generator.selectors.privateKey)
    const tokenContract = new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const owner = new ethers.Wallet(privateKey).address
    const wallet = sdk.precomputeAddress({ owner })
    const amountFormatted = utils.parseUnits(String(amount.trim()), decimals)
    const data = yield tokenContract.interface.functions.transfer.encode([address, amountFormatted])

    const params = {
      safe: wallet,
      to: tokenAddress,
      data: data,
      value: '0',
      privateKey
    }

    const result = yield sdk.executeTx(params)
    const { success, errors, txHash } = result
    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
      yield put({
        type: 'TOKENS.SET_TRANSACTION_DATA',
        payload: {
          transactionData: {
            value: String(amount.trim()),
            tokenAddress,
            status: 'loading'
          }
        }
      })
    } else {
      window.alert('Some error occured')
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      if (errors.length > 0) {
        console.error(errors[0])
      }
    }
  } catch (e) {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    window.alert('Some error occured')
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  wallet: ({ user: { wallet } }) => wallet,
  privateKey: ({ user: { privateKey } }) => privateKey,
  chainId: ({ user: { chainId } }) => chainId
}
