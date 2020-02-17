import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { result, amount, tokenAddress, tokenId } = payload
    const { success, errors, txHash } = result
    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
      yield put({
        type: 'TOKENS.SET_TRANSACTION_DATA',
        payload: {
          transactionData: {
            value: amount && String(amount.trim()),
            tokenAddress,
            tokenId,
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
    console.error(e)
  }
}

export default generator
