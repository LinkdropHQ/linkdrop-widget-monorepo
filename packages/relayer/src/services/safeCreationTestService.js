import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import PayingProxy from '@gnosis.pm/safe-contracts/build/contracts/PayingProxy'
import LinkdropModule from '@linkdrop/safe-module-contracts/build/LinkdropModule'
import { ethers } from 'ethers'
import assert from 'assert-js'
import relayerWalletService from './relayerWalletService'
import logger from '../utils/logger'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import sdkService from './sdkService'
import ensService from './ensService'
import linkdropFactoryService from './linkdropFactoryService'
import Web3 from 'web3'

import {
  GNOSIS_SAFE_MASTERCOPY_ADDRESS,
  PROXY_FACTORY_ADDRESS,
  MULTISEND_LIBRARY_ADDRESS,
  CREATE_AND_ADD_MODULES_LIBRARY_ADDRESS,
  LINKDROP_MODULE_MASTERCOPY_ADDRESS,
  MULTISEND_WITH_REFUND_ADDRESS
} from '../../config/config.json'

const web3 = new Web3(relayerWalletService.jsonRpcUrl)

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

const CALL_OP = 0
const DELEGATECALL_OP = 1

class SafeCreationService {
  constructor () {
    this.gnosisSafeMasterCopy = new ethers.Contract(
      GNOSIS_SAFE_MASTERCOPY_ADDRESS,
      GnosisSafe.abi,
      relayerWalletService.provider
    )

    this.proxyFactory = new ethers.Contract(
      PROXY_FACTORY_ADDRESS,
      ProxyFactory.abi,
      relayerWalletService.wallet
    )

    this.multiSend = new ethers.Contract(
      MULTISEND_LIBRARY_ADDRESS,
      MultiSend.abi,
      relayerWalletService.provider
    )

    this.multiSendWithRefund = new ethers.Contract(
      MULTISEND_WITH_REFUND_ADDRESS,
      MultiSend.abi,
      relayerWalletService.provider
    )

    this.createAndAddModules = new ethers.Contract(
      CREATE_AND_ADD_MODULES_LIBRARY_ADDRESS,
      CreateAndAddModules.abi,
      relayerWalletService.provider
    )

    this.linkdropModuleMasterCopy = new ethers.Contract(
      LINKDROP_MODULE_MASTERCOPY_ADDRESS,
      LinkdropModule.abi,
      relayerWalletService.provider
    )
  }

  async create ({ owner, name, saltNonce }) {
    try {
      logger.info('Creating new safe with ENS...')

      const ensOwner = await ensService.getOwner(
        `${name}.${ensService.ensDomain}`
      )

      assert.true(
        ensOwner === ADDRESS_ZERO,
        'Provided name already has an owner'
      )

      const linkdropModuleSetupData = sdkService.walletSDK.encodeParams(
        LinkdropModule.abi,
        'setup',
        [[owner]]
      )
      logger.debug(`linkdropModuleSetupData: ${linkdropModuleSetupData}`)

      const linkdropModuleCreationData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [
          this.linkdropModuleMasterCopy.address,
          linkdropModuleSetupData,
          saltNonce
        ]
      )
      logger.debug(`linkdropModuleCreationData: ${linkdropModuleCreationData}`)

      const modulesCreationData = sdkService.walletSDK.encodeDataForCreateAndAddModules(
        [linkdropModuleCreationData]
      )
      logger.debug(`modulesCreationData: ${modulesCreationData}`)

      const createAndAddModulesData = sdkService.walletSDK.encodeParams(
        CreateAndAddModules.abi,
        'createAndAddModules',
        [this.proxyFactory.address, modulesCreationData]
      )
      logger.debug(`createAndAddModulesData: ${createAndAddModulesData}`)

      const createAndAddModulesMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        DELEGATECALL_OP,
        this.createAndAddModules.address,
        0,
        createAndAddModulesData
      )
      logger.debug(
        `createAndAddModulesMultiSendData: ${createAndAddModulesMultiSendData}`
      )

      let nestedTxData = '0x' + createAndAddModulesMultiSendData
      logger.debug(`nestedTxData: ${nestedTxData}`)

      let multiSendData = sdkService.walletSDK.encodeParams(
        MultiSend.abi,
        'multiSend',
        [nestedTxData]
      )
      logger.debug(`multiSendData: ${multiSendData}`)

      const safe = sdkService.walletSDK.computeSafeAddress({
        owner,
        saltNonce,
        gnosisSafeMasterCopy: GNOSIS_SAFE_MASTERCOPY_ADDRESS,
        deployer: PROXY_FACTORY_ADDRESS,
        to: this.multiSend.address,
        data: multiSendData
      })
      logger.debug(`Computed safe address: ${safe}`)

      const linkdropModule = sdkService.walletSDK.computeLinkdropModuleAddress({
        owner,
        saltNonce,
        linkdropModuleMasterCopy: LINKDROP_MODULE_MASTERCOPY_ADDRESS,
        deployer: safe
      })
      logger.debug(`Computed linkdrop module address: ${linkdropModule}`)

      let gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          this.multiSend.address, // to
          multiSendData, // data,
          ADDRESS_ZERO, // payment token address
          0, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      let createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )
      logger.debug(`createSafeData: ${createSafeData}`)

      let createSafeMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        this.proxyFactory.address,
        0,
        createSafeData
      )
      logger.debug(`createSafeMultiSendData: ${createSafeMultiSendData}`)

      // const registrar = await ensService.getRegistrarContract()

      // const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
      // logger.debug(`label: ${label}`)

      // const registerEnsData = sdkService.walletSDK.encodeParams(
      //   FIFSRegistrar.abi,
      //   'register',
      //   [label, safe]
      // )
      // logger.debug(`registerEnsData: ${registerEnsData}`)

      // const registerEnsMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
      //   CALL_OP,
      //   registrar.address,
      //   0,
      //   registerEnsData
      // )
      // logger.debug(`registerEnsMultiSendData: ${registerEnsMultiSendData}`)

      nestedTxData = '0x' + createSafeMultiSendData // + registerEnsMultiSendData
      logger.debug(`nestedTxData: ${nestedTxData}`)

      multiSendData = sdkService.walletSDK.encodeParams(
        MultiSend.abi,
        'multiSend',
        [nestedTxData]
      )
      logger.debug(`multiSendData: ${multiSendData}`)

      // const tx = await relayerWalletService.wallet.sendTransaction({
      //   to: this.multiSendWithRefund.address,
      //   data: multiSendData,
      //   gasPrice: ethers.utils.parseUnits('20', 'gwei'),
      //   gasLimit: 6500000
      // })

      const rawTx = {
        to: this.multiSendWithRefund.address,
        data: multiSendData,
        gasPrice: ethers.utils.parseUnits('20', 'gwei'),
        gasLimit: 6500000
      }

      const estim = await relayerWalletService.provider.estimateGas(rawTx)
      console.log('estim: ', +estim)
      const userCosts = estim.mul(20)
      console.log('userCosts: ', +userCosts, 'wei')

      let bal = await relayerWalletService.provider.getBalance(safe)
      console.log('bal: ', +bal)
      console.log('Funding safe...')

      const ttx = await relayerWalletService.wallet.sendTransaction({
        to: safe,
        value: 1234033423423,
        gasPrice: ethers.utils.parseUnits('20', 'gwei')
      })

      await relayerWalletService.provider.waitForTransaction(ttx.hash, 2)

      bal = await relayerWalletService.provider.getBalance(safe)
      console.log('bal: ', +bal)

      gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          this.multiSend.address, // to
          multiSendData, // data,
          ADDRESS_ZERO, // payment token address
          12, // payment amount usercosts
          relayerWalletService.wallet.address // payment receiver address
        ]
      )
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )
      logger.debug(`createSafeData: ${createSafeData}`)

      createSafeMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        this.proxyFactory.address,
        0,
        createSafeData
      )
      logger.debug(`createSafeMultiSendData: ${createSafeMultiSendData}`)

      nestedTxData = '0x' + createSafeMultiSendData // + registerEnsMultiSendData
      logger.debug(`nestedTxData: ${nestedTxData}`)

      multiSendData = sdkService.walletSDK.encodeParams(
        MultiSend.abi,
        'multiSend',
        [nestedTxData]
      )
      logger.debug(`multiSendData: ${multiSendData}`)

      const tx = await this.proxyFactory.createProxyWithNonce(
        this.gnosisSafeMasterCopy.address,
        gnosisSafeData,
        saltNonce,
        { gasLimit: 6500000 }
      )

      // const tx = await relayerWalletService.wallet.sendTransaction({
      //   to: this.multiSendWithRefund.address,
      //   data: multiSendData,
      //   gasPrice: ethers.utils.parseUnits('20', 'gwei'),
      //   gasLimit: 6500000
      // })

      logger.json({ txHash: tx.hash, safe, linkdropModule }, 'info')
      return { success: true, txHash: tx.hash, linkdropModule, safe }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }
}

export default new SafeCreationService()
