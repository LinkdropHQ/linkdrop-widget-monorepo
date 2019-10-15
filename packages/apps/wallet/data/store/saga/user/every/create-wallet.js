import { put, select } from 'redux-saga/effects'

// const web3 = new Web3(Web3.givenProvider)

const generator = function * () {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const { privateKey, contractAddress } = yield select(generator.selectors.userData)
    if (privateKey && contractAddress) {
      window.alert('private key and contractAddress already exist')
      throw new Error('NETWORK ERROR')
    }

    // owner, // wallet (public key)
    // ensName, // {spacehaz}.bla..
    // saltNonce, // +(new Data) // ? string
    // gasPrice, // wei (atomic)

    // const data = yield sdk.create({

    // })

    // privateKey = data.privateKey
    // contractAddress = data.contractAddress

    yield put({ type: 'USER.SET_USER_DATA', payload: { privateKey, contractAddress } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  userData: ({ user: { privateKey, contractAddress } }) => ({ privateKey, contractAddress })
}
