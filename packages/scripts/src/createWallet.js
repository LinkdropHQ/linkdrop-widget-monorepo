import WalletSDK from '../../sdk/src'
import { create } from '../sdk/src/createSafe'
import { ethers } from 'ethers'
const walletSDK = new WalletSDK({})

;(async () => {
  const ensName = Math.random()

    .toString(36)
    .substring(2, 15)

  const saltNonce = Math.floor(Math.random() * 30000)
  console.log('ensName: ', ensName)
  console.log('saltNonce: ', saltNonce)

  const {
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy
  } = await create({
    owner: '0x2C5641c0075b7E9D25C5f597b4D80B7A5a53Cea1',
    ensName,
    saltNonce,
    guardian: '0x2C5641c0075b7E9D25C5f597b4D80B7A5a53Cea1',
    recoveryPeriod: 1234234,
    jsonRpcUrl: 'https://rinkeby.infura.io',
    gnosisSafeMasterCopy: walletSDK.gnosisSafeMasterCopy,
    proxyFactory: walletSDK.proxyFactory,
    linkdropModuleMasterCopy: walletSDK.linkdropModuleMasterCopy,
    recoveryModuleMasterCopy: walletSDK.recoveryModuleMasterCopy,
    multiSend: walletSDK.multiSend,
    createAndAddModules: walletSDK.createAndAddModules,
    apiHost: 'http://localhost:5050',
    ens: walletSDK.ens,
    ensDomain: 'linkdrop.test'
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
