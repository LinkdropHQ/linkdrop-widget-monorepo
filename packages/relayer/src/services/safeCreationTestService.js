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
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      const createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )
      logger.debug(`createSafeData: ${createSafeData}`)

      const rawTx = {
        to: this.proxyFactory.address,
        data: createSafeData,
        gasPrice: ethers.utils.parseUnits('20', 'gwei'),
        gasLimit: 6500000
      }
      const gasPrice = ethers.utils.parseUnits('20', 'gwei')
      const estim = (await relayerWalletService.provider.estimateGas(
        rawTx
      )).add(9000)
      console.log('estim: ', +estim)
      const userCosts = estim.mul(gasPrice) // .mul(gasPrice)
      console.log('userCosts: ', +userCosts, 'wei')

      gnosisSafeData = sdkService.walletSDK.encodeParams(
        GnosisSafe.abi,
        'setup',
        [
          [owner], // owners
          1, // threshold
          ADDRESS_ZERO, // to
          '0x', // data,
          ADDRESS_ZERO, // payment token address
          userCosts, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )

      const safe = sdkService.walletSDK.computeSafeAddress({
        owner,
        saltNonce,
        gnosisSafeMasterCopy: GNOSIS_SAFE_MASTERCOPY_ADDRESS,
        paymentAmount: userCosts.toNumber()
      })
      logger.debug(`Computed safe address: ${safe}`)

      relayerWalletService.provider.on(safe, balance => {
        logger.info('BALANCE CHANGES 1')
        logger.info(+balance)
      })

      let bal = await relayerWalletService.provider.getBalance(safe)
      bal = bal.toNumber()

      if (bal === 0) {
        console.log('Funding safe...')
        const ttx = await relayerWalletService.wallet.sendTransaction({
          to: safe,
          value: userCosts,
          gasPrice: ethers.utils.parseUnits('20', 'gwei')
        })

        await relayerWalletService.provider.waitForTransaction(ttx.hash, 3)

        bal = await relayerWalletService.provider.getBalance(safe)
        console.log('bal: ', +bal)
      }

      // const tx = await this.proxyFactory.createProxyWithNonce(
      //   this.gnosisSafeMasterCopy.address,
      //   gnosisSafeData,
      //   saltNonce,
      //   { gasLimit: 6500000, gasPrice: ethers.utils.parseUnits('20', 'gwei') }
      // )

      // const tx = await relayerWalletService.wallet.sendTransaction({
      //   to: this.multiSendWithRefund.address,
      //   data: multiSendData,
      //   gasPrice: ethers.utils.parseUnits('20', 'gwei'),
      //   gasLimit: 6500000
      // })

      const linkdropModule = ''

      logger.json({ txHash: tx.hash, safe, linkdropModule }, 'info')
      return { success: true, txHash: tx.hash, linkdropModule, safe }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }
}

export default new SafeCreationService()
