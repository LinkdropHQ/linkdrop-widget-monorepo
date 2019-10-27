import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * () {
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
    yield delay(3000)
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: 'http://localhost:9002/#/receive?weiAmount=10000000000000000&tokenAddress=0xa3b5fdeb5dbc592ffc5e222223376464b9c56fb8&tokenAmount=25000000000000000000&expirationTime=1900000000000&version=1&chainId=1&linkKey=0xc59f4f1c9df3f8b3c682eff9affa6dc42880afa891b809588b026c88974e89cd&linkdropMasterAddress=0x6c0f58ad4eb24da5769412bf34ddee698c4d185b&linkdropSignerSignature=0xd520582278898116fe28816eab06f2296eed5c3213014387c3c2411178f78670078f29974166ad18273cba8b08b437496a58b086d4dfe573bf2f21f559e87acd1c&campaignId=10&dappId=zrx-instant' } })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
  }
}

export default generator
generator.selectors = {
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  sdk: ({ user: { sdk } }) => sdk,
  chainId: ({ user: { chainId } }) => chainId,
  privateKey: ({ user: { privateKey } }) => privateKey,
  wallet: ({ user: { wallet } }) => wallet,
  items: ({ assets: { items } }) => items
}
