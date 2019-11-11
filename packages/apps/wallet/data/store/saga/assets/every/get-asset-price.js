import { call } from 'redux-saga/effects'
import getAssetPrice from './get-asset-price'

export default function * ({ chainId, symbol }) {
  try {
    if (Number(chainId) !== 1) { return 0 }
    return yield call(getAssetPrice, { symbol })
  } catch (error) {
    return 0
  }
}
