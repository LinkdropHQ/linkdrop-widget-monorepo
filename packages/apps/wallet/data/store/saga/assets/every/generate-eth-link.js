import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { amount } = payload
    const sdk = yield select(generator.selectors.sdk)
    const privateKey = yield select(generator.selectors.privateKey)
    const owner = new ethers.Wallet(privateKey).address
    const safe = sdk.precomputeAddress({ owner })
    const linkdropModuleAddress = sdk.precomputeLinkdropModuleAddress(owner, safe)
    const { url } = yield sdk.generateLink({
      signingKeyOrWallet: privateKey,
      linkdropModuleAddress: linkdropModuleAddress,
      weiAmount: String(utils.parseUnits(String(amount).trim(), 18)),
      tokenAddress: ethers.constants.AddressZero,
      tokenAmount: 0,
      expirationTime: 1900000000000
    })

    if (url) {
      yield put({ type: 'ASSETS.SET_LINK', payload: { link: url } })
    } else {
      alert('some error occured with sdk method generateLinkERC20')
    }

    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    console.error({ error })
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  privateKey: ({ user: { privateKey } }) => privateKey
}
