import { defineNetworkName } from '@linkdrop/commons'
import { put, select } from 'redux-saga/effects'
import NFTMock from 'contracts/NFTMock.json'
import { utils, ethers } from 'ethers'
import { convertEns } from './helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    const { to, tokenAddress, tokenId } = payload
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
      return yield put({
        type: 'USER.SET_ERRORS',
        payload: { errors: ['ENS_INVALID'] }
      })
    }

    const privateKey = yield select(generator.selectors.privateKey)
    const tokenContract = new ethers.Contract(
      tokenAddress,
      NFTMock.abi,
      provider
    )
    const wallet = yield select(generator.selectors.wallet)
    const data = yield tokenContract.interface.functions.safeTransferFrom.encode(
      [wallet, address, tokenId]
    )

    const params = {
      safe: wallet,
      to: tokenAddress,
      data,
      value: '0',
      privateKey
    }
    const result = yield sdk.executeTx(params)
    const { success, errors, txHash } = result
    if (success) {
      yield put({
        type: 'TOKENS.SET_TRANSACTION_ID',
        payload: { transactionId: txHash }
      })
      yield put({
        type: 'TOKENS.SET_TRANSACTION_DATA',
        payload: {
          transactionData: {
            tokenId,
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
