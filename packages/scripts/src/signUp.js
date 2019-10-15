import WalletSDK from '../../sdk/src/WalletSDK'
import { ethers } from 'ethers'
const walletSDK = new WalletSDK({})

const main = async () => {
  const res = await walletSDK.signup('amir', 'password')
}

main()
