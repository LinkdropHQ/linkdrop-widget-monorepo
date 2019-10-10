import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '../../../contracts/build/LinkdropModule'
import RecoveryModule from '../../../contracts/build/RecoveryModule.json'
import { ethers } from 'ethers'
import assert from 'assert-js'
import relayerWalletService from './relayerWalletService'
import logger from '../utils/logger'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import sdkService from './sdkService'
import ensService from './ensService'
import linkdropFactoryService from './linkdropFactoryService'

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

    this.recoveryModuleMasterCopy = new ethers.Contract(
      RECOVERY_MODULE_MASTERCOPY_ADDRESS,
      RecoveryModule.abi,
      relayerWalletService.provider
    )
  }

  async create ({ data, gasPrice }) {
    try {
      const tx = await relayerWalletService.wallet.sendTransaction({
        to: this.multiSendWithRefund.address,
        data,
        gasPrice: ethers.utils.parseUnits(gasPrice, 'wei'),
        gasLimit: 6500000
      })

      logger.json({ txHash: tx.hash }, 'info')

      return {
        success: true,
        txHash: tx.hash
      }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }

  async claimAndCreate ({ data, gasPrice }) {
    try {
      logger.info('Creating new safe with ENS and claiming linkdrop...')

      const tx = await relayerWalletService.wallet.sendTransaction({
        to: this.multiSendWithRefund.address,
        data,
        gasPrice: ethers.utils.parseUnits(gasPrice, 'wei'),
        gasLimit: 6950000
      })

      logger.json({ txHash: tx.hash }, 'info')

      return {
        success: true,
        txHash: tx.hash
      }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }
}

export default new SafeCreationService()
