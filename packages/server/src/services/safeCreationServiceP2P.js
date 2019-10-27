import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '../../../contracts/build/LinkdropModule'
import RecoveryModule from '../../../contracts/build/RecoveryModule'

import { ethers } from 'ethers'
import assert from 'assert-js'
import relayerWalletService from './relayerWalletService'
import logger from '../utils/logger'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import sdkService from './sdkService'
import ensService from './ensService'
import linkdropFactoryService from './linkdropFactoryService'
import accountsService from './accountsService'

import {
  GNOSIS_SAFE_MASTERCOPY_ADDRESS,
  PROXY_FACTORY_ADDRESS,
  MULTISEND_LIBRARY_ADDRESS,
  CREATE_AND_ADD_MODULES_LIBRARY_ADDRESS,
  LINKDROP_MODULE_MASTERCOPY_ADDRESS,
  MULTISEND_WITH_REFUND_ADDRESS,
  RECOVERY_MODULE_MASTERCOPY_ADDRESS,
  RECOVERY_PERIOD
} from '../../config/config.json'
import linkdropModuleService from './linkdropModuleService'

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

const CALL_OP = 0
const DELEGATECALL_OP = 1

class SafeCreationServiceP2P {
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

    this.recoveryModuleMasterCopy = new ethers.Contract(
      RECOVERY_MODULE_MASTERCOPY_ADDRESS,
      RecoveryModule.abi,
      relayerWalletService.provider
    )
  }

  async claimAndCreateP2P ({
    owner,
    saltNonce,
    ensName,
    guardian,
    recoveryPeriod,
    gasPrice,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverSignature,
    email,
    createAndAddModulesSafeTxData
  }) {
    logger.debug('In claimAndCreateP2P')

    try {
      let account = await accountsService.findAccount(email)
      if (!account) {
        throw new Error('Account with such email is not registered')
      }

      logger.info('Creating new safe with ENS and claiming linkdrop...')

      let gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          ADDRESS_ZERO, // to
          '0x', // data,
          ADDRESS_ZERO, // payment token address
          0, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )

      let createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )

      const estimate = (await relayerWalletService.provider.estimateGas({
        to: this.proxyFactory.address,
        data: createSafeData,
        gasPrice
      })).add(104000)

      const creationCosts = estimate.mul(gasPrice)

      gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          ADDRESS_ZERO, // to
          '0x', // data,
          ADDRESS_ZERO, // payment token address
          creationCosts, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )

      createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )

      const createSafeMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        this.proxyFactory.address,
        0,
        createSafeData
      )

      const safe = sdkService.walletSDK.computeSafeAddress({
        owner,
        saltNonce,
        gnosisSafeMasterCopy: this.gnosisSafeMasterCopy.address,
        deployer: this.proxyFactory.address,
        to: ADDRESS_ZERO,
        data: '0x',
        paymentAmount: creationCosts.toString()
      })

      const createAndAddModulesMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        safe,
        0,
        createAndAddModulesSafeTxData
      )
      // const registerEnsData = sdkService.walletSDK.encodeParams(
      //   FIFSRegistrar.abi,
      //   'register',
      //   [ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ensName)), safe]
      // )

      // const registrar = await sdkService.walletSDK.getEnsOwner({
      //   ensAddress: ensService.ens.address,
      //   ensDomain: ensService.ensDomain,
      //   jsonRpcUrl: relayerWalletService.jsonRpcUrl
      // })

      // const registerEnsMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
      //   CALL_OP,
      //   registrar,
      //   0,
      //   registerEnsData
      // )

      const claimData = sdkService.walletSDK.encodeParams(
        linkdropModuleService.abi,
        'claimLink',
        [
          weiAmount,
          tokenAddress,
          tokenAmount,
          expirationTime,
          linkId,
          linkdropSignerSignature,
          safe,
          receiverSignature
        ]
      )

      const claimMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        linkdropModuleAddress,
        0,
        claimData
      )

      const nestedTxData =
        '0x' +
        claimMultiSendData +
        createSafeMultiSendData +
        createAndAddModulesMultiSendData
      // + registerEnsMultiSendData

      const multiSendData = sdkService.walletSDK.encodeParams(
        MultiSend.abi,
        'multiSend',
        [nestedTxData]
      )

      const linkdropModule = sdkService.walletSDK.computeLinkdropModuleAddress({
        owner,
        saltNonce,
        linkdropModuleMasterCopy: this.linkdropModuleMasterCopy.address,
        deployer: safe
      })

      const recoveryModule = sdkService.walletSDK.computeRecoveryModuleAddress({
        guardian,
        recoveryPeriod,
        saltNonce,
        recoveryModuleMasterCopy: this.recoveryModuleMasterCopy.address,
        deployer: safe
      })

      logger.debug('Sending tx...:')
      logger.json({
        to: this.multiSendWithRefund.address,
        data: multiSendData
      })

      const tx = await relayerWalletService.wallet.sendTransaction({
        to: this.multiSendWithRefund.address,
        data: multiSendData,
        gasPrice:
          gasPrice > 0
            ? ethers.utils.parseUnits(gasPrice, 'wei')
            : ethers.utils.parseUnits('10', 'gwei'),
        gasLimit: 1000000
      })

      account = await accountsService.update({
        email,
        deployed: true,
        ens: `${ensName}.${ensService.ensDomain}`,
        owner,
        saltNonce,
        safe,
        linkdropModule,
        recoveryModule,
        createSafeData
      })

      logger.json(
        { txHash: tx.hash, safe, linkdropModule, recoveryModule },
        'info'
      )

      return {
        success: true,
        txHash: tx.hash,
        safe,
        linkdropModule,
        recoveryModule
      }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }

  async claimAndCreateERC721P2P ({
    owner,
    saltNonce,
    ensName,
    guardian,
    recoveryPeriod,
    gasPrice,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverSignature,
    email,
    createAndAddModulesSafeTxData
  }) {
    logger.debug('In claimAndCreateERC721P2P')

    try {
      let account = await accountsService.findAccount(email)
      if (!account) {
        throw new Error('Account with such email is not registered')
      }

      logger.info('Creating new safe with ENS and claiming ERC721 linkdrop...')

      let gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          ADDRESS_ZERO, // to
          '0x', // data,
          ADDRESS_ZERO, // payment token address
          0, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )

      let createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )

      const estimate = (await relayerWalletService.provider.estimateGas({
        to: this.proxyFactory.address,
        data: createSafeData,
        gasPrice
      })).add(104000)

      const creationCosts = estimate.mul(gasPrice)

      gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          ADDRESS_ZERO, // to
          '0x', // data,
          ADDRESS_ZERO, // payment token address
          creationCosts, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )

      createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )

      const createSafeMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        this.proxyFactory.address,
        0,
        createSafeData
      )

      const safe = sdkService.walletSDK.computeSafeAddress({
        owner,
        saltNonce,
        gnosisSafeMasterCopy: this.gnosisSafeMasterCopy.address,
        deployer: this.proxyFactory.address,
        to: ADDRESS_ZERO,
        data: '0x',
        paymentAmount: creationCosts.toString()
      })

      const createAndAddModulesMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        safe,
        0,
        createAndAddModulesSafeTxData
      )

      // const registerEnsData = sdkService.walletSDK.encodeParams(
      //   FIFSRegistrar.abi,
      //   'register',
      //   [ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ensName)), safe]
      // )

      // const registrar = await sdkService.walletSDK.getEnsOwner({
      //   ensAddress: ensService.ens.address,
      //   ensDomain: ensService.ensDomain,
      //   jsonRpcUrl: relayerWalletService.jsonRpcUrl
      // })

      // const registerEnsMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
      //   CALL_OP,
      //   registrar,
      //   0,
      //   registerEnsData
      // )

      const claimData = sdkService.walletSDK.encodeParams(
        linkdropModuleService.abi,
        'claimLinkERC721',
        [
          weiAmount,
          nftAddress,
          tokenId,
          expirationTime,
          linkId,
          linkdropSignerSignature,
          safe,
          receiverSignature
        ]
      )

      const claimMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        linkdropModuleAddress,
        0,
        claimData
      )

      const nestedTxData =
        '0x' +
        claimMultiSendData +
        createSafeMultiSendData +
        createAndAddModulesMultiSendData
      // +  registerEnsMultiSendData

      const multiSendData = sdkService.walletSDK.encodeParams(
        MultiSend.abi,
        'multiSend',
        [nestedTxData]
      )

      const linkdropModule = sdkService.walletSDK.computeLinkdropModuleAddress({
        owner,
        saltNonce,
        linkdropModuleMasterCopy: this.linkdropModuleMasterCopy.address,
        deployer: safe
      })

      const recoveryModule = sdkService.walletSDK.computeRecoveryModuleAddress({
        guardian,
        recoveryPeriod,
        saltNonce,
        recoveryModuleMasterCopy: this.recoveryModuleMasterCopy.address,
        deployer: safe
      })

      logger.debug('Sending tx...:')
      logger.json({
        to: this.multiSendWithRefund.address,
        data: multiSendData
      })

      const tx = await relayerWalletService.wallet.sendTransaction({
        to: this.multiSendWithRefund.address,
        data: multiSendData,
        gasPrice:
          gasPrice > 0
            ? ethers.utils.parseUnits(gasPrice, 'wei')
            : ethers.utils.parseUnits('10', 'gwei'),
        gasLimit: 4500000
      })

      account = await accountsService.update({
        email,
        deployed: true,
        ens: `${ensName}.${ensService.ensDomain}`,
        owner,
        saltNonce,
        safe,
        linkdropModule,
        recoveryModule,
        createSafeData
      })

      logger.json(
        { txHash: tx.hash, safe, linkdropModule, recoveryModule },
        'info'
      )

      return {
        success: true,
        txHash: tx.hash,
        safe,
        linkdropModule,
        recoveryModule
      }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }
}

export default new SafeCreationServiceP2P()
