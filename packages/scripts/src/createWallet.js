import WalletSDK from '../../sdk/src'
import { ethers } from 'ethers'
const walletSDK = new WalletSDK({})

;(async () => {
  const ensName = Math.random()
    .toString(36)
    .substring(2, 15)

  const saltNonce = new Date().getTime().toString()
  console.log('ensName: ', ensName)
  console.log('saltNonce: ', saltNonce)

  const {
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy
  } = await walletSDK.create({
    owner: '0x2C5641c0075b7E9D25C5f597b4D80B7A5a53Cea1',
    ensName,
    saltNonce,
    gasPrice: ethers.utils.parseUnits('10', 'gwei').toString()
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
})()
