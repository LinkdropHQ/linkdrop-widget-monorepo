import WalletSDK from '../../sdk/src/WalletSDK'
const walletSDK = new WalletSDK({})

const main = async () => {
  await walletSDK.signUp('Email', 'Password')
}

main()
