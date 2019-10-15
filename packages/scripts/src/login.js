import WalletSDK from '../../sdk/src/WalletSDK'
const walletSDK = new WalletSDK({})

const main = async () => {
  const res = await walletSDK.login('email9', 'password')
  console.log('res: ', res)
}

main()
