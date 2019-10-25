import WalletSDK from '../../sdk/src/WalletSDK'

const walletSDK = new WalletSDK({ apiHost: 'http://localhost:5050' })

const main = async () => {
  console.log(await walletSDK.register('amiromayer@gmail.com', 'password'))
}

main()
