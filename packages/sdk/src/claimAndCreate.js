import axios from 'axios'
import assert from 'assert-js'
import { ethers } from 'ethers'
import {
  signReceiverAddress,
  encodeParams,
  encodeDataForCreateAndAddModules
} from './utils'
import { computeSafeAddress } from './computeSafeAddress'
import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
import { computeRecoveryModuleAddress } from './computeRecoveryModuleAddress'
import { getEnsOwner } from './ensUtils'
import { signTx } from './signTx'

import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '../../contracts/build/LinkdropModule'
import RecoveryModule from '../../contracts/build/RecoveryModule'

const ADDRESS_ZERO = ethers.constants.AddressZero

/**
 * Function to create new safe and claim linkdrop
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {String} tokenAmount Token amount
 * @param {String} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key assigned to link
 * @param {String} linkdropMasterAddress Linkdrop master address
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} campaignId Campaign id
 * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
 * @param {String} proxyFactory Deployed proxy factory address
 * @param {String} privateKey Safe owner's private key
 * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address
 * @param {String} createAndAddModules Deployed createAndAddModules library address
 * @param {String} multiSend Deployed multiSend library address
 * @param {String} apiHost API host
 * @param {String} saltNonce Random salt nonce
 * @param {String} guardian Guardian address
 * @param {String} recoveryPeriod Recovery period
 * @param {String} recoveryModuleMasterCopy Deployed recovery moduel mastercopy address
 * @param {String} ensName ENS name (e.g. 'alice')
 * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth)
 * @param {String} ensAddress ENS address
 * @param {String} jsonRpcUrl JSON RPC URL
 * @returns {Object} {success, txHash, safe, errors}
 */
export const claimAndCreate = async ({
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  campaignId,
  gnosisSafeMasterCopy,
  proxyFactory,
  privateKey,
  linkdropModuleMasterCopy,
  createAndAddModules,
  multiSend,
  apiHost,
  saltNonce,
  guardian,
  recoveryPeriod,
  recoveryModuleMasterCopy,
  gasPrice,
  ensName,
  ensDomain,
  ensAddress,
  jsonRpcUrl,
  email
}) => {
  assert.string(weiAmount, 'Wei amount is required')
  assert.string(tokenAddress, 'Token address is required')
  assert.string(tokenAmount, 'Token amount is required')
  assert.string(expirationTime, 'Expiration time is required')
  assert.string(linkKey, 'Link key is required')
  assert.string(linkdropMasterAddress, 'Linkdrop master address is requred')
  assert.string(
    linkdropSignerSignature,
    'Linkdrop signer signature is required'
  )
  assert.string(campaignId, 'Campaign id is required')
  assert.string(
    gnosisSafeMasterCopy,
    'Gnosis safe mastercopy address is required'
  )
  assert.string(proxyFactory, 'Proxy factory address is required')
  assert.string(privateKey, 'Private key is required')
  assert.string(apiHost, 'Api host is required')
  assert.string(ensName, 'Ens name is required')
  assert.string(saltNonce, 'Salt nonce is required')
  assert.string(gasPrice, 'Gas price is required')
  assert.string(guardian, 'Guardian address is required')
  assert.string(recoveryPeriod, 'Recovery period is required')
  assert.string(ensAddress, 'Ens address is required')
  assert.string(ensDomain, 'Ens domain is required')
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
  assert.string(jsonRpcUrl, 'Json rpc url is required')
  assert.string(apiHost, 'Api host is required')
  assert.string(email, 'Email is required')

  const ensOwner = await getEnsOwner({
    ensName,
    ensDomain,
    ensAddress,
    jsonRpcUrl
  })
  assert.true(ensOwner === ADDRESS_ZERO, 'Provided name already has an owner')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  const owner = new ethers.Wallet(privateKey).address

  let gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
    [owner], // owners
    1, // threshold
    ADDRESS_ZERO, // to
    '0x', // data,
    ADDRESS_ZERO, // payment token address
    0, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])

  let createSafeData = encodeParams(ProxyFactory.abi, 'createProxyWithNonce', [
    gnosisSafeMasterCopy,
    gnosisSafeData,
    saltNonce
  ])

  const estimate = (await provider.estimateGas({
    to: proxyFactory,
    data: createSafeData,
    gasPrice
  })).add(104000)

  const creationCosts = estimate.mul(gasPrice)

  gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
    [owner], // owners
    1, // threshold
    ADDRESS_ZERO, // to
    '0x', // data,
    ADDRESS_ZERO, // payment token address
    creationCosts, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])

  createSafeData = encodeParams(ProxyFactory.abi, 'createProxyWithNonce', [
    gnosisSafeMasterCopy,
    gnosisSafeData,
    saltNonce
  ])

  const safe = computeSafeAddress({
    owner,
    saltNonce,
    gnosisSafeMasterCopy,
    deployer: proxyFactory,
    to: ADDRESS_ZERO,
    data: '0x',
    paymentAmount: creationCosts.toString()
  })

  const linkdropModule = computeLinkdropModuleAddress({
    owner,
    saltNonce,
    linkdropModuleMasterCopy,
    deployer: safe
  })

  const recoveryModule = computeRecoveryModuleAddress({
    guardian,
    recoveryPeriod,
    saltNonce,
    recoveryModuleMasterCopy,
    deployer: safe
  })

  const receiverSignature = await signReceiverAddress(linkKey, safe)
  const linkId = new ethers.Wallet(linkKey).address

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

  const signature = signTx({
    safe,
    privateKey,
    to: createAndAddModules,
    value: '0',
    data: createAndAddModulesData,
    operation: '1', // delegatecall
    safeTxGas: '0',
    baseGas: '0',
    gasPrice: '0',
    gasToken: ADDRESS_ZERO,
    refundReceiver: ADDRESS_ZERO,
    nonce: '0'
  })

  const createAndAddModulesSafeTxData = encodeParams(
    GnosisSafe.abi,
    'execTransaction',
    [
      createAndAddModules,
      0,
      createAndAddModulesData,
      1,
      0,
      0,
      0,
      ADDRESS_ZERO,
      ADDRESS_ZERO,
      signature
    ]
  )

  const response = await axios.post(`${apiHost}/api/v1/safes/claimAndCreate`, {
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
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverSignature,
    email,
    createAndAddModulesSafeTxData
  })

  const { success, txHash, errors } = response.data

  return {
    success,
    txHash,
    linkdropModule,
    recoveryModule,
    safe,
    creationCosts,
    errors
  }
}
