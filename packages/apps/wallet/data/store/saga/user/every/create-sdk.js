import { put, select } from 'redux-saga/effects'
import { initializeWalletSdk } from 'data/sdk'
import { defineNetworkName } from '@linkdrop/commons'
import config from 'app.config.js'
import { getApiHostWallet, getParentHost } from 'helpers'

const generator = function * ({ payload }) {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const apiHost = getApiHostWallet({ chainId })
    const claimHost = getParentHost()
    const sdk = initializeWalletSdk({
      chain: networkName,
      infuraPk: config.infuraPk,
      apiHost,
      claimHost
    })

    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    yield put({ type: '*USER.FETCH_PK' })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
