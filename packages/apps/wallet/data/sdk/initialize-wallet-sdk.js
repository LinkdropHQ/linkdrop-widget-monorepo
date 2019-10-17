import WalletSDK from '@huskiapp/sdk/src/index'

export default ({ chain }) => {
  const sdk = new WalletSDK({ chain })
  console.log({ sdk })
  return sdk
}
