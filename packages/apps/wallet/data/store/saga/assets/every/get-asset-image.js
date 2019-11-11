import { call } from 'redux-saga/effects'
import { getERC721TokenData } from 'data/api/tokens'

export default function * ({ metadataURL }) {
  try {
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return data.image
  } catch (error) {
    return ''
  }
}
