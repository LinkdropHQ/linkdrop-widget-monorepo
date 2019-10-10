/* global describe, before, it */

import chai, { expect } from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import { ethers } from 'ethers'

import CreateAndAddModules from '../../../build/CreateAndAddModules'
import ProxyFactory from '../../../build/ProxyFactory'
import GnosisSafe from '../../../build/GnosisSafe'
import RecoveryModule from '../../../build/RecoveryModule'

import {
  encodeDataForCreateAndAddModules,
  encodeParams,
  getParamFromTxEvent
} from '../../../../sdk/src/utils'

import { signTx } from '../../../../sdk/src/signTx'

ethers.errors.setLogLevel('error')
chai.use(solidity)

const ADDRESS_ZERO = ethers.constants.AddressZero
const ZERO_BYTES = '0x'
const ZERO = 0
const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'

// Just for testing purposes
// Change to 3 * 24 * 60 in production in order to represent
const RECOVERY_PERIOD_IN_SECONDS = 3

const provider = createMockProvider()

const [
  deployer,
  firstOwner,
  secondOwner,
  guardian,
  secondGuardian
] = getWallets(provider)

let gnosisSafe, recoveryModule, modules

describe('Recovery Module Tests', () => {
  //
  describe('Connection to Gnosis Safe', () => {
    before(async () => {
      let proxyFactory = await deployContract(deployer, ProxyFactory)

      let createAndAddModules = await deployContract(
        deployer,
        CreateAndAddModules
      )

      let gnosisSafeMasterCopy = await deployContract(
        deployer,
        GnosisSafe,
        [],
        {
          gasLimit: 6500000
        }
      )

      const recoveryModuleMasterCopy = await deployContract(
        deployer,
        RecoveryModule
      )

      const moduleData = encodeParams(RecoveryModule.abi, 'setup', [
        [guardian.address],
        RECOVERY_PERIOD_IN_SECONDS
      ])

      const proxyFactoryData = encodeParams(ProxyFactory.abi, 'createProxy', [
        recoveryModuleMasterCopy.address,
        moduleData
      ])

      const modulesCreationData = encodeDataForCreateAndAddModules([
        proxyFactoryData
      ])

      const createAndAddModulesData = encodeParams(
        CreateAndAddModules.abi,
        'createAndAddModules',
        [proxyFactory.address, modulesCreationData]
      )

      const gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
        [firstOwner.address], // owners
        1, // treshold
        createAndAddModules.address, // to
        createAndAddModulesData, // data,
        ADDRESS_ZERO, // payment token address
        ZERO, // payment amount
        ADDRESS_ZERO // payment receiver address
      ])

      const proxy = await getParamFromTxEvent(
        await proxyFactory.createProxy(
          gnosisSafeMasterCopy.address,
          gnosisSafeData,
          { gasLimit: 6500000 }
        ), // tx
        'ProxyCreation', // eventName
        'proxy', // paramName
        proxyFactory // contract
      )

      gnosisSafe = new ethers.Contract(proxy, GnosisSafe.abi, provider)

      modules = await gnosisSafe.getModules()

      recoveryModule = new ethers.Contract(
        modules[0],
        RecoveryModule.abi,
        deployer
      )
    })

    it('should set gnosis safe as recovery module manager', async () => {
      expect(await recoveryModule.manager()).to.equal(gnosisSafe.address)
    })

    it('should correctly set guardian', async () => {
      expect(await recoveryModule.isGuardian(guardian.address)).to.be.true
    })

    it('should correctly set recovery period', async () => {
      expect(await recoveryModule.recoveryPeriod()).to.equal(
        RECOVERY_PERIOD_IN_SECONDS
      )
    })

    it('should fail to initiate recovery from non guardian account', async () => {
      await expect(recoveryModule.initiateRecovery()).to.be.revertedWith(
        'Only guardian'
      )
      expect(await recoveryModule.recoveryInitiated()).to.eq(0)
    })

    it('should be able to initiate recovery from guardian', async () => {
      recoveryModule = recoveryModule.connect(guardian)
      await recoveryModule.initiateRecovery()
      expect(await recoveryModule.recoveryInitiated()).to.not.eq(0)
    })

    it('should fail to initiate recovery twice', async () => {
      await expect(recoveryModule.initiateRecovery()).to.be.revertedWith(
        'Recovery is already initiated'
      )
    })

    it('should fail to cancel recovery from non owner account', async () => {
      await expect(recoveryModule.cancelRecovery()).to.be.revertedWith(
        'Method can only be called from manager'
      )
    })

    it('should be able to cancel recovery via Safe transaction', async () => {
      expect(await recoveryModule.recoveryInitiated()).to.not.eq(0)

      gnosisSafe = gnosisSafe.connect(deployer)

      const to = recoveryModule.address
      const value = 0
      const data = encodeParams(RecoveryModule.abi, 'cancelRecovery', [])
      const operation = 0
      const safeTxGas = 0
      const baseGas = 0
      const gasPrice = 0
      const gasToken = ADDRESS_ZERO
      const refundReceiver = ADDRESS_ZERO
      const nonce = await gnosisSafe.nonce()

      const signature = await signTx({
        safe: gnosisSafe.address,
        privateKey: firstOwner.privateKey,
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce: nonce.toNumber()
      })

      await gnosisSafe.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        signature
      )

      expect(await recoveryModule.recoveryInitiated()).to.eq(0)
      expect(await gnosisSafe.nonce()).to.eq(nonce.add(1))
    })

    it('should fail to recover access from non guardian account', async () => {
      await recoveryModule.initiateRecovery()
      expect(await recoveryModule.recoveryInitiated()).to.not.eq(0)

      recoveryModule = recoveryModule.connect(deployer)

      await expect(
        recoveryModule.recoverAccess(
          SENTINEL_ADDRESS,
          firstOwner.address,
          secondOwner.address
        )
      ).to.be.revertedWith('Only guardian')
    })

    it('should fail to recover access when recovery period is not over', async () => {
      recoveryModule = recoveryModule.connect(guardian)

      await expect(
        recoveryModule.recoverAccess(
          SENTINEL_ADDRESS,
          firstOwner.address,
          secondOwner.address
        )
      ).to.be.revertedWith('Recovery period is not over')
    })

    it('should fail to remove guardian with any account', async () => {
      await expect(
        recoveryModule.removeGuardian(guardian.address)
      ).to.be.revertedWith('Method can only be called from manager')

      expect(await recoveryModule.isGuardian(guardian.address)).to.be.true
    })

    it('should be able to remove guardian via Safe transaction', async () => {
      gnosisSafe = gnosisSafe.connect(deployer)

      const to = recoveryModule.address
      const value = 0
      const data = encodeParams(RecoveryModule.abi, 'removeGuardian', [
        guardian.address
      ])
      const operation = 0
      const safeTxGas = 0
      const baseGas = 0
      const gasPrice = 0
      const gasToken = ADDRESS_ZERO
      const refundReceiver = ADDRESS_ZERO
      const nonce = await gnosisSafe.nonce()

      const signature = await signTx({
        safe: gnosisSafe.address,
        privateKey: firstOwner.privateKey,
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce: nonce.toNumber()
      })

      await gnosisSafe.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        signature
      )

      expect(await recoveryModule.isGuardian(guardian.address)).to.be.false
      expect(await gnosisSafe.nonce()).to.eq(nonce.add(1))
    })

    it('should be able to add new guardian via Safe transaction', async () => {
      gnosisSafe = gnosisSafe.connect(deployer)

      const to = recoveryModule.address
      const value = 0
      const data = encodeParams(RecoveryModule.abi, 'addGuardian', [
        secondGuardian.address
      ])
      const operation = 0
      const safeTxGas = 0
      const baseGas = 0
      const gasPrice = 0
      const gasToken = ADDRESS_ZERO
      const refundReceiver = ADDRESS_ZERO
      const nonce = await gnosisSafe.nonce()

      const signature = await signTx({
        safe: gnosisSafe.address,
        privateKey: firstOwner.privateKey,
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce: nonce.toNumber()
      })

      await gnosisSafe.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        signature
      )

      expect(await recoveryModule.isGuardian(guardian.address)).to.be.false
      expect(await recoveryModule.isGuardian(secondGuardian.address)).to.be.true
      expect(await gnosisSafe.nonce()).to.eq(nonce.add(1))
    })

    it('should be able to recover access after recovery period is over', async () => {
      recoveryModule = recoveryModule.connect(secondGuardian)
      console.log('\n      Waiting for recovery period to be over...\n')

      setTimeout(async () => {
        expect(await recoveryModule.recoveryInitiated()).to.not.eq(0)

        await recoveryModule.recoverAccess(
          SENTINEL_ADDRESS,
          firstOwner.address,
          secondOwner.address
        )

        expect(await recoveryModule.recoveryInitiated()).to.eq(0)
      }, RECOVERY_PERIOD_IN_SECONDS * 1000)
    })
  })
})
