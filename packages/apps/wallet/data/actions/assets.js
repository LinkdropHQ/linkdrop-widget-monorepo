class Assets {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, tokenAmount, weiAmount }) {
    this.actions.dispatch({ type: '*ASSETS.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, tokenAmount, weiAmount } })
  }

  getTokenERC721Data ({ nftAddress, tokenId, weiAmount }) {
    this.actions.dispatch({ type: '*ASSETS.GET_TOKEN_ERC721_DATA', payload: { nftAddress, tokenId, weiAmount } })
  }

  saveClaimedAssets () {
    this.actions.dispatch({ type: '*ASSETS.SAVE_CLAIMED_ASSETS' })
  }

  getItems () {
    this.actions.dispatch({ type: '*ASSETS.GET_ITEMS' })
  }

  sendERC20 ({ to, amount, tokenAddress, decimals }) {
    this.actions.dispatch({ type: '*ASSETS.SEND_ERC20', payload: { to, amount, tokenAddress, decimals } })
  }

  sendERC721 ({ to, tokenId, tokenAddress }) {
    this.actions.dispatch({ type: '*ASSETS.SEND_ERC721', payload: { to, tokenId, tokenAddress } })
  }

  sendETH ({ to, amount }) {
    this.actions.dispatch({ type: '*ASSETS.SEND_ETH', payload: { to, amount } })
  }

  clearLink () {
    this.actions.dispatch({ type: 'ASSETS.SET_LINK', payload: { link: null } })
  }

  generateERC721Link ({ nftAddress, tokenId }) {
    this.actions.dispatch({ type: '*ASSETS.GENERATE_ERC721_LINK', payload: { nftAddress, tokenId } })
  }

  generateERC20Link ({ tokenAddress, amount, decimals }) {
    this.actions.dispatch({ type: '*ASSETS.GENERATE_ERC20_LINK', payload: { tokenAddress, amount, decimals } })
  }

  generateETHLink ({ amount }) {
    this.actions.dispatch({ type: '*ASSETS.GENERATE_ETH_LINK', payload: { amount } })
  }
}

export default Assets
