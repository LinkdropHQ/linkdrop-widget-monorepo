class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ campaignId, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS', payload: { tokenType: 'erc20', campaignId, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } })
  }

  claimTokensERC721 ({ campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropMasterAddress }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS', payload: { tokenType: 'erc721', campaignId, nftAddress, tokenId, weiAmount, linkdropMasterAddress, expirationTime, linkKey, linkdropSignerSignature } })
  }

  checkTransactionStatus ({ transactionId, chainId, statusToAdd }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, chainId, statusToAdd } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropMasterAddress, campaignId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropMasterAddress, campaignId } })
  }

  setTransactionId ({ transactionId }) {
    this.actions.dispatch({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId } })
  }

  setTransactionStatus ({ transactionStatus }) {
    this.actions.dispatch({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus } })
  }

  setTransactionData ({ transactionData }) {
    this.actions.dispatch({ type: 'TOKENS.SET_TRANSACTION_DATA', payload: { transactionData } })
  }
}

export default Tokens
