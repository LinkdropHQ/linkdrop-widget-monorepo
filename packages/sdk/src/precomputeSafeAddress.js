import assert from 'assert-js'
import { computeSafeAddress } from './computeSafeAddress'
import { ethers } from 'ethers'
import {
  encodeParams,
  encodeDataForCreateAndAddModules,
  encodeDataForMultiSend
} from './utils'

import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '../../contracts/build/LinkdropModule'
import RecoveryModule from '../../contracts/build/RecoveryModule.json'

const DELEGATECALL_OP = 1

export const precomputeSafeAddressWithModules = async ({
  gnosisSafeMasterCopy,
  proxyFactory,
  owner,
  linkdropModuleMasterCopy,
  createAndAddModules,
  multiSend,
  saltNonce,
  guardian,
  recoveryPeriod,
  recoveryModuleMasterCopy
}) => {
  assert.string(
    gnosisSafeMasterCopy,
    'Gnosis safe mastercopy address is required'
  )
  assert.string(proxyFactory, 'Proxy factory address is required')
  assert.string(owner, 'Owner is required')
  assert.string(saltNonce, 'Salt nonce is required')
  assert.string(guardian, 'Guardian address is required')
  assert.string(recoveryPeriod, 'Recovery period is required')
  assert.string(
    gnosisSafeMasterCopy,
    'Gnosis safe mastercopy address is required'
  )

  assert.string(
    linkdropModuleMasterCopy,
    'Linkdrop module mastercopy address is required'
  )
  assert.string(
    recoveryModuleMasterCopy,
    'Recovery module mastercopy address is required'
  )
  assert.string(multiSend, 'MultiSend library address is required')
  assert.string(
    createAndAddModules,
    'CreateAndAddModules library address is required'
  )

  const linkdropModuleSetupData = encodeParams(LinkdropModule.abi, 'setup', [
    [owner]
  ])

  const linkdropModuleCreationData = encodeParams(
    ProxyFactory.abi,
    'createProxyWithNonce',
    [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]
  )

  const recoveryModuleSetupData = encodeParams(RecoveryModule.abi, 'setup', [
    [guardian],
    recoveryPeriod
  ])

  const recoveryModuleCreationData = encodeParams(
    ProxyFactory.abi,
    'createProxyWithNonce',
    [recoveryModuleMasterCopy, recoveryModuleSetupData, saltNonce]
  )

  const modulesCreationData = encodeDataForCreateAndAddModules([
    linkdropModuleCreationData,
    recoveryModuleCreationData
  ])

  const createAndAddModulesData = encodeParams(
    CreateAndAddModules.abi,
    'createAndAddModules',
    [proxyFactory, modulesCreationData]
  )

  const createAndAddModulesMultiSendData = encodeDataForMultiSend(
    DELEGATECALL_OP,
    createAndAddModules,
    0,
    createAndAddModulesData
  )

  let nestedTxData = '0x' + createAndAddModulesMultiSendData
  let multiSendData = encodeParams(MultiSend.abi, 'multiSend', [nestedTxData])

  const safe = computeSafeAddress({
    owner,
    saltNonce,
    gnosisSafeMasterCopy: gnosisSafeMasterCopy,
    deployer: proxyFactory,
    to: multiSend,
    data: multiSendData,
    paymentAmount: '0'
  })
  return safe
}
