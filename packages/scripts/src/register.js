import WalletSDK from '../../sdk/src/WalletSDK'
import { EMAIL } from '../config/config.json'

const walletSDK = new WalletSDK({ apiHost: 'http://localhost:5050' })

const main = async () => {
  console.log(await walletSDK.register(EMAIL, 'password'))
}

main()
