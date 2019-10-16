import WalletSDK from '@huskiapp/sdk/src/index'

export default ({ chain, infuraPk, factoryAddress }) => {
  return new WalletSDK(chain, infuraPk)
}
