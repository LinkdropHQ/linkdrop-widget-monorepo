import axios from 'axios'
import assert from 'assert-js'
import { computeSafeAddress } from './computeSafeAddress'
import { ethers } from 'ethers'
import { encodeParams, encodeDataForCreateAndAddModules } from './utils'
import { signTx } from './signTx'

import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '../../contracts/build/LinkdropModule'
import RecoveryModule from '../../contracts/build/RecoveryModule.json'

import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
import { computeRecoveryModuleAddress } from './computeRecoveryModuleAddress'

import { getEnsOwner } from './ensUtils'

const ADDRESS_ZERO = ethers.constants.AddressZero

/**
 * @param  {String} privateKey Owner's private key
 * @param  {String} ensName Ens name
 * @param  {String} saltNonce Random salt nonce
 * @param  {String} recoveryPeriod Recovery period in atomic units (seconds)
 * @param  {String} gasPrice Gas price in wei
 * @param  {String} guardian Guardian address
 * @param  {String} ensAddress Ens address
 * @param  {String} ensDomain Ens domain (e.g. 'my-domain.eth)
 * @param  {String} jsonRpcUrl JSON RPC URL
 * @param  {String} apiHost API host
 * @param  {String} gnosisSafeMasterCopy Deployed Gnosis Safe mastercopy address
 * @param  {String} proxyFactory Deployed proxy factory address
 * @param  {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
 * @param  {String} recoveryModuleMasterCopy Deployed recovery module mastercopy address
 * @param  {String} multiSend Deployed MultiSend library address
 * @param  {String} createAndAddModules Deployed CreateAndAddModules library address
 * @param {String} gasPrice Gas price in wei
 * @param {String} email Email
 */
export const create = async ({
  privateKey,
  ensName,
  ensAddress,
  ensDomain,
  saltNonce,
  guardian,
  recoveryPeriod,
  jsonRpcUrl,
  apiHost,
  gnosisSafeMasterCopy,
  proxyFactory,
  linkdropModuleMasterCopy,
  recoveryModuleMasterCopy,
  multiSend,
  createAndAddModules,
  gasPrice,
  email
}) => {
  assert.string(privateKey, 'Private key is required')
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
  assert.string(proxyFactory, 'Proxy factory address is required')
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
  assert.string(gasPrice, 'Gas price is required')
  assert.string(email, 'Email is required')

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
  })).add(9000)

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

  const waitForBalance = async () => {
    const balance = await provider.getBalance(safe)

    return new Promise(resolve => {
      if (balance.gte(creationCosts)) {
        resolve()
      }
      provider.on(safe, balance => {
        if (balance.gte(creationCosts)) {
          resolve()
        }
      })
    })
  }

  const deploy = async () => {
    return deployWallet({
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice,
      ensDomain,
      ensAddress,
      apiHost,
      jsonRpcUrl,
      email,
      createAndAddModulesSafeTxData
    })
  }

  return {
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts: creationCosts.toString(),
    waitForBalance,
    deploy
  }
}

/**
 * Function to deploy new safe
 * @param {String} owner Safe owner address
 * @param {String} ensName ENS name to register
 * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth')
 * @param {String} ensAddress ENS address
 * @param {String} data Creation data
 * @param {String} gasPrice Gas price in wei
 * @param {String} apiHost API host
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} email Email
 * @param {String} createAndAddModulesSafeTxData Data to be sent via Safe tx to CreateAndAddModules library
 * @returns {Object} {success, txHash, errors}
 */
const deployWallet = async ({
  owner,
  saltNonce,
  ensName,
  guardian,
  recoveryPeriod,
  gasPrice,
  ensDomain,
  ensAddress,
  apiHost,
  jsonRpcUrl,
  email,
  createAndAddModulesSafeTxData
}) => {
  try {
    const ensOwner = await getEnsOwner({
      ensName,
      ensDomain,
      ensAddress,
      jsonRpcUrl
    })
    assert.true(ensOwner === ADDRESS_ZERO, 'Provided name already has an owner')

    const response = await axios.post(`${apiHost}/api/v1/safes`, {
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice,
      createAndAddModulesSafeTxData,
      email
    })

    const {
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    } = response.data

    return {
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    }
  } catch (err) {
    return { success: false, errors: err.message || err }
  }
}
