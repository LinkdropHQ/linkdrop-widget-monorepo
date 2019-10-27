import WalletSDK from '../../sdk/src'
import { ethers } from 'ethers'

import { PRIVATE_KEY, EMAIL } from '../config/config.json'

const walletSDK = new WalletSDK({ apiHost: 'http://localhost:5050' })

const main = async () => {
  const ensName = Math.random()
    .toString(36)
    .substring(2, 15)

  const {
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy
  } = await walletSDK.create({
    privateKey: PRIVATE_KEY,
    ensName,
    email: EMAIL,
    gasPrice: '4000000000' // 4 gwei
  })

  console.log({
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy
  })

  console.log('Waiting for balance...')
  await waitForBalance()

  console.log('Deploying wallet...')
  const { txHash, success, errors } = await deploy()
  console.log({ txHash, success, errors })
}

main()
