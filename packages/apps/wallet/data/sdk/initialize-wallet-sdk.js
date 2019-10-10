import WalletSDK from '@huskiapp/sdk/src/index'

export default ({ chain, infuraPk, factoryAddress }) => {
  console.log({ chain, infuraPk, factoryAddress })
  return new WalletSDK(chain, infuraPk)
}
