import { takeEvery } from 'redux-saga/effects'

import claimTokensERC20 from './every/claim-tokens-erc20'
import claimTokensERC721 from './every/claim-tokens-erc721'

import claimTokensERC20AndDeploy from './every/claim-tokens-erc20-and-deploy'
import claimTokensERC721AndDeploy from './every/claim-tokens-erc721-and-deploy'

import checkTransactionStatus from './every/check-transaction-status'
import checkIfClaimed from './every/check-if-claimed'
import claimTokens from './every/claim-tokens'

export default function * () {
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC20', claimTokensERC20)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC721', claimTokensERC721)
  yield takeEvery('*TOKENS.CHECK_TRANSACTION_STATUS', checkTransactionStatus)
  yield takeEvery('*TOKENS.CHECK_IF_CLAIMED', checkIfClaimed)
  yield takeEvery('*TOKENS.CLAIM_TOKENS', claimTokens)
  yield takeEvery('*TOKENS.CHECK_IF_CLAIMED', checkIfClaimed)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC20_AND_DEPLOY', claimTokensERC20AndDeploy)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC721_AND_DEPLOY', claimTokensERC721AndDeploy)
}
