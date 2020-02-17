import WalletSDK from '@linkdrop-widget/sdk/src/index'

export default ({ chain, apiHost, claimHost }) => new WalletSDK({ chain, claimHost, apiHost })
