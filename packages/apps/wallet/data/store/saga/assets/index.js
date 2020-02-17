import { takeEvery } from 'redux-saga/effects'
import getTokenERC20Data from './every/get-token-erc20-data'
import getTokenERC721Data from './every/get-token-erc721-data'
import getPastEvents from './every/get-past-events'
import getEthData from './every/get-eth-data'
import subscribeToClaimEvent from './every/subscribe-to-claim-event'
import saveClaimedAssets from './every/save-claimed-assets'
import getItems from './every/get-items'
import sendERC20 from './every/send-erc20'
import sendEth from './every/send-eth'
import sendERC721 from './every/send-erc721'
import generateERC721Link from './every/generate-erc721-link'
import generateERC20Link from './every/generate-erc20-link'
import generateETHToken from './every/generate-eth-link'

export default function * () {
  yield takeEvery('*ASSETS.GET_TOKEN_ERC20_DATA', getTokenERC20Data)
  yield takeEvery('*ASSETS.GET_ETH_DATA', getEthData)
  yield takeEvery('*ASSETS.GET_TOKEN_ERC721_DATA', getTokenERC721Data)
  yield takeEvery('*ASSETS.GET_PAST_EVENTS', getPastEvents)
  yield takeEvery('*ASSETS.SUBSCRIBE_TO_CLAIM_EVENT', subscribeToClaimEvent)
  yield takeEvery('*ASSETS.SAVE_CLAIMED_ASSETS', saveClaimedAssets)
  yield takeEvery('*ASSETS.GET_ITEMS', getItems)
  yield takeEvery('*ASSETS.SEND_ERC20', sendERC20)
  yield takeEvery('*ASSETS.SEND_ETH', sendEth)
  yield takeEvery('*ASSETS.SEND_ERC721', sendERC721)
  yield takeEvery('*ASSETS.GENERATE_ERC721_LINK', generateERC721Link)
  yield takeEvery('*ASSETS.GENERATE_ERC20_LINK', generateERC20Link)
  yield takeEvery('*ASSETS.GENERATE_ETH_LINK', generateETHToken)
}
