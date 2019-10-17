import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import { ethers } from 'ethers'
import { getEns } from 'helpers'

const generator = function * ({ payload }) {
  try {
    const { campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropMasterAddress } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const email = yield select(generator.selectors.email)
    const chainId = yield select(generator.selectors.chainId)
    const privateKey = yield select(generator.selectors.privateKey)
    const ens = getEns({ email, chainId })

    console.log({
      weiAmount: weiAmount || '0',
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      linkdropMasterAddress,
      campaignId,
      email,
      owner: new ethers.Wallet(privateKey).address,
      ensName: ens.slice(0, ens.indexOf('.')),
      saltNonce: String(+(new Date())),
      gasPrice: '0'
    })

    const { success, txHash, errors } = yield sdk.claimAndCreateERC721({
      weiAmount: weiAmount || '0',
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      linkdropMasterAddress,
      campaignId,
      email,
      owner: new ethers.Wallet(privateKey).address,
      ensName: ens.slice(0, ens.indexOf('.')),
      saltNonce: String(+(new Date())),
      gasPrice: '0'
    })

    console.log({ txHash })

    // {
    //   owner: new ethers.Wallet(privateKey).address, +
    //   ensName: динамически создать на основе имейла, +
    //   saltNonce: String(+(new Date())),
    //   gasPrice: "0",
    // }

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
  email: ({ user: { email } }) => email,
  ens: ({ user: { ens } }) => ens,
  privateKey: ({ user: { privateKey } }) => privateKey,
  chainId: ({ user: { chainId } }) => chainId
}
