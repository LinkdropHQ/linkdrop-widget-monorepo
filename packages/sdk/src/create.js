import axios from 'axios'
import assert from 'assert-js'
import { computeSafeAddress } from './computeSafeAddress'
import { ethers } from 'ethers'
import {
  encodeParams,
  encodeDataForCreateAndAddModules,
  encodeDataForMultiSend,
  signReceiverAddress
} from './utils'

import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '../../contracts/build/LinkdropModule'
import RecoveryModule from '../../contracts/build/RecoveryModule.json'

import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
import { computeRecoveryModuleAddress } from './computeRecoveryModuleAddress'

import { getEnsOwner } from './ensUtils'

import { FIFSRegistrar } from '@ensdomains/ens'

const CALL_OP = 0
const DELEGATECALL_OP = 1

const ADDRESS_ZERO = ethers.constants.AddressZero

export const create = async ({
  owner,
  ensName, // ens name
  ensAddress, // ens address
  ensDomain, // ens domain
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
  gasPrice // in wei
}) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

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

  let gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
    [owner], // owners
    1, // threshold
    multiSend, // to
    multiSendData, // data,
    ADDRESS_ZERO, // payment token address
    0, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])

  let createSafeData = encodeParams(ProxyFactory.abi, 'createProxyWithNonce', [
    gnosisSafeMasterCopy,
    gnosisSafeData,
    saltNonce
  ])

  gasPrice = gasPrice || (await provider.getGasPrice()).toNumber()

  const estimate = (await provider.estimateGas({
    to: proxyFactory,
    data: createSafeData,
    gasPrice
  })).add(9000)

  const creationCosts = estimate.mul(gasPrice)

  gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
    [owner], // owners
    1, // threshold
    multiSend, // to
    multiSendData, // data,
    ADDRESS_ZERO, // payment token address
    creationCosts, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])

  createSafeData = encodeParams(ProxyFactory.abi, 'createProxyWithNonce', [
    gnosisSafeMasterCopy,
    gnosisSafeData,
    saltNonce
  ])

  const createSafeMultiSendData = encodeDataForMultiSend(
    CALL_OP,
    proxyFactory,
    0,
    createSafeData
  )

  const safe = computeSafeAddress({
    owner,
    saltNonce,
    gnosisSafeMasterCopy: gnosisSafeMasterCopy,
    deployer: proxyFactory,
    to: multiSend,
    data: multiSendData,
    paymentAmount: creationCosts.toNumber()
  })

  const registerEnsData = encodeParams(FIFSRegistrar.abi, 'register', [
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ensName)),
    safe
  ])

  const registrar = await getEnsOwner({ ensAddress, ensDomain, jsonRpcUrl })

  const registerEnsMultiSendData = encodeDataForMultiSend(
    CALL_OP,
    registrar,
    0,
    registerEnsData
  )

  nestedTxData = '0x' + createSafeMultiSendData + registerEnsMultiSendData

  multiSendData = encodeParams(MultiSend.abi, 'multiSend', [nestedTxData])

  const linkdropModule = computeLinkdropModuleAddress({
    owner,
    saltNonce,
    linkdropModuleMasterCopy,
    deployer: safe
  })

  const recoveryModule = computeRecoveryModuleAddress({
    guardians: [guardian],
    recoveryPeriod,
    saltNonce,
    recoveryModuleMasterCopy,
    deployer: safe
  })

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
      ensName,
      ensDomain,
      ensAddress,
      jsonRpcUrl,
      data: multiSendData,
      apiHost,
      gasPrice
    })
  }

  return {
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy
  }
}

// const saltNonce = new Date().getTime()

/**
 * Function to deploy new safe
 * @param {String} owner Safe owner's address
 * @param {String} name ENS name to register for safe
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
export const deployWallet = async ({
  ensName,
  ensDomain,
  ensAddress,
  jsonRpcUrl,
  data,
  gasPrice,
  apiHost
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
      data,
      gasPrice
    })

    const { success, txHash, errors } = response.data

    return {
      success,
      txHash,
      errors
    }
  } catch (err) {
    return { success: false, errors: err.message || err }
  }
}

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
 * @param {String} owner Safe owner address
 * @param {String} name ENS name to register for safe
 * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address
 * @param {String} createAndAddModules Deployed createAndAddModules library address
 * @param {String} multiSend Deployed multiSend library address
 * @param {String} apiHost API host
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
  owner,
  name,
  linkdropModuleMasterCopy,
  createAndAddModules,
  multiSend,
  apiHost,
  saltNonce
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
  assert.string(owner, 'Owner is required')
  assert.string(name, 'Name is required')
  assert.string(apiHost, 'Api host is required')

  assert.string(
    linkdropModuleMasterCopy,
    'Linkdrop module mastercopy address is required'
  )
  assert.string(
    createAndAddModules,
    'CreateAndAddModules library address is required'
  )
  assert.string(multiSend, 'MultiSend library address is required')

  const linkdropModuleSetupData = encodeParams(LinkdropModule.abi, 'setup', [
    [owner]
  ])

  const linkdropModuleCreationData = encodeParams(
    ProxyFactory.abi,
    'createProxyWithNonce',
    [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]
  )

  const modulesCreationData = encodeDataForCreateAndAddModules([
    linkdropModuleCreationData
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

  const nestedTxData = '0x' + createAndAddModulesMultiSendData

  const multiSendData = encodeParams(MultiSend.abi, 'multiSend', [nestedTxData])

  let safe = computeSafeAddress({
    owner,
    saltNonce,
    gnosisSafeMasterCopy,
    deployer: proxyFactory,
    to: multiSend,
    data: multiSendData
  })

  const receiverSignature = await signReceiverAddress(linkKey, safe)
  const linkId = new ethers.Wallet(linkKey).address

  const response = await axios.post(`${apiHost}/api/v1/safes/claimAndCreate`, {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress: safe,
    receiverSignature,
    owner,
    name,
    saltNonce
  })

  const {
    success,
    txHash,
    linkdropModule,
    recoveryModule,
    errors
  } = response.data

  return {
    success,
    txHash,
    linkdropModule,
    recoveryModule,
    safe,
    errors
  }
}
