import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import { defineAddressFromEns, prepareSendParams } from './helpers'
import handleSendResponse from './handle-send-response'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })

    const { to, amount } = payload
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const address = yield defineAddressFromEns({ to, provider })
    if (!address) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      return yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['ENS_INVALID'] } })
    }

    const sdk = yield select(generator.selectors.sdk)
    const privateKey = yield select(generator.selectors.privateKey)
    const params = yield prepareSendParams({
      type: 'eth',
      amount,
      chainId,
      sdk,
      sendTo: address,
      privateKey
    })

    const result = yield sdk.executeTx(params)

    yield handleSendResponse({
      payload: {
        result,
        amount,
        tokenAddress: ethers.constants.AddressZero
      }
    })
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
