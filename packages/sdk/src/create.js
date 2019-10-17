// import axios from 'axios'
// import assert from 'assert-js'
// import { computeSafeAddress } from './computeSafeAddress'
// import { ethers } from 'ethers'
// import {
//   encodeParams,
//   encodeDataForCreateAndAddModules,
//   encodeDataForMultiSend
// } from './utils'

// import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
// import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
// import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
// import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
// import LinkdropModule from '../../contracts/build/LinkdropModule'
// import RecoveryModule from '../../contracts/build/RecoveryModule.json'

// import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
// import { computeRecoveryModuleAddress } from './computeRecoveryModuleAddress'

// import { getEnsOwner } from './ensUtils'

// import { FIFSRegistrar } from '@ensdomains/ens'

// const CALL_OP = 0
// const DELEGATECALL_OP = 1

// const ADDRESS_ZERO = ethers.constants.AddressZero

// /**
//  * @param  {String} owner Owner address
//  * @param  {String} ensName Ens name
//  * @param  {String} saltNonce Random salt nonce
//  * @param  {String} recoveryPeriod Recovery period in atomic units (seconds)
//  * @param  {String} gasPrice Gas price in wei
//  * @param  {String} guardian Guardian address
//  * @param  {String} ensAddress Ens address
//  * @param  {String} ensDomain Ens domain (e.g. 'my-domain.eth)
//  * @param  {String} jsonRpcUrl JSON RPC URL
//  * @param  {String} apiHost API host
//  * @param  {String} gnosisSafeMasterCopy Deployed Gnosis Safe mastercopy address
//  * @param  {String} proxyFactory Deployed proxy factory address
//  * @param  {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
//  * @param  {String} recoveryModuleMasterCopy Deployed recovery module mastercopy address
//  * @param  {String} multiSend Deployed MultiSend library address
//  * @param  {String} createAndAddModules Deployed CreateAndAddModules library address
//  */
// export const create = async ({
//   owner,
//   ensName,
//   ensAddress,
//   ensDomain,
//   saltNonce,
//   guardian,
//   recoveryPeriod,
//   jsonRpcUrl,
//   apiHost,
//   gnosisSafeMasterCopy,
//   proxyFactory,
//   linkdropModuleMasterCopy,
//   recoveryModuleMasterCopy,
//   multiSend,
//   createAndAddModules,
//   gasPrice
// }) => {
//   assert.string(owner, 'Owner is required')
//   assert.string(ensName, 'Ens name is required')
//   assert.string(saltNonce, 'Salt nonce is required')
//   assert.string(gasPrice, 'Gas price is required')
//   assert.string(guardian, 'Guardian address is required')
//   assert.string(recoveryPeriod, 'Recovery period is required')
//   assert.string(ensAddress, 'Ens address is required')
//   assert.string(ensDomain, 'Ens domain is required')
//   assert.string(
//     gnosisSafeMasterCopy,
//     'Gnosis safe mastercopy address is required'
//   )
//   assert.string(proxyFactory, 'Proxy factory address is required')
//   assert.string(
//     linkdropModuleMasterCopy,
//     'Linkdrop module mastercopy address is required'
//   )
//   assert.string(
//     recoveryModuleMasterCopy,
//     'Recovery module mastercopy address is required'
//   )
//   assert.string(multiSend, 'MultiSend library address is required')
//   assert.string(
//     createAndAddModules,
//     'CreateAndAddModules library address is required'
//   )
//   assert.string(jsonRpcUrl, 'Json rpc url is required')
//   assert.string(apiHost, 'Api host is required')

//   const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

//   const linkdropModuleSetupData = encodeParams(LinkdropModule.abi, 'setup', [
//     [owner]
//   ])

//   const linkdropModuleCreationData = encodeParams(
//     ProxyFactory.abi,
//     'createProxyWithNonce',
//     [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]
//   )

//   const recoveryModuleSetupData = encodeParams(RecoveryModule.abi, 'setup', [
//     [guardian],
//     recoveryPeriod
//   ])

//   const recoveryModuleCreationData = encodeParams(
//     ProxyFactory.abi,
//     'createProxyWithNonce',
//     [recoveryModuleMasterCopy, recoveryModuleSetupData, saltNonce]
//   )

//   const modulesCreationData = encodeDataForCreateAndAddModules([
//     linkdropModuleCreationData,
//     recoveryModuleCreationData
//   ])

//   const createAndAddModulesData = encodeParams(
//     CreateAndAddModules.abi,
//     'createAndAddModules',
//     [proxyFactory, modulesCreationData]
//   )

//   const createAndAddModulesMultiSendData = encodeDataForMultiSend(
//     DELEGATECALL_OP,
//     createAndAddModules,
//     0,
//     createAndAddModulesData
//   )

//   let nestedTxData = '0x' + createAndAddModulesMultiSendData

//   let multiSendData = encodeParams(MultiSend.abi, 'multiSend', [nestedTxData])

//   let gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
//     [owner], // owners
//     1, // threshold
//     multiSend, // to
//     multiSendData, // data,
//     ADDRESS_ZERO, // payment token address
//     0, // payment amount
//     ADDRESS_ZERO // payment receiver address
//   ])

//   let createSafeData = encodeParams(ProxyFactory.abi, 'createProxyWithNonce', [
//     gnosisSafeMasterCopy,
//     gnosisSafeData,
//     saltNonce
//   ])

//   gasPrice = gasPrice || (await provider.getGasPrice()).toString()

//   const estimate = (await provider.estimateGas({
//     to: proxyFactory,
//     data: createSafeData,
//     gasPrice
//   })).add(9000)

//   const creationCosts = estimate.mul(gasPrice)

//   gnosisSafeData = encodeParams(GnosisSafe.abi, 'setup', [
//     [owner], // owners
//     1, // threshold
//     multiSend, // to
//     multiSendData, // data,
//     ADDRESS_ZERO, // payment token address
//     creationCosts, // payment amount
//     ADDRESS_ZERO // payment receiver address
//   ])

//   createSafeData = encodeParams(ProxyFactory.abi, 'createProxyWithNonce', [
//     gnosisSafeMasterCopy,
//     gnosisSafeData,
//     saltNonce
//   ])

//   const createSafeMultiSendData = encodeDataForMultiSend(
//     CALL_OP,
//     proxyFactory,
//     0,
//     createSafeData
//   )

//   const safe = computeSafeAddress({
//     owner,
//     saltNonce,
//     gnosisSafeMasterCopy: gnosisSafeMasterCopy,
//     deployer: proxyFactory,
//     to: multiSend,
//     data: multiSendData,
//     paymentAmount: creationCosts.toString()
//   })

//   const registerEnsData = encodeParams(FIFSRegistrar.abi, 'register', [
//     ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ensName)),
//     safe
//   ])

//   const registrar = await getEnsOwner({ ensAddress, ensDomain, jsonRpcUrl })

//   const registerEnsMultiSendData = encodeDataForMultiSend(
//     CALL_OP,
//     registrar,
//     0,
//     registerEnsData
//   )

//   nestedTxData = '0x' + createSafeMultiSendData + registerEnsMultiSendData

//   multiSendData = encodeParams(MultiSend.abi, 'multiSend', [nestedTxData])

//   const linkdropModule = computeLinkdropModuleAddress({
//     owner,
//     saltNonce,
//     linkdropModuleMasterCopy,
//     deployer: safe
//   })

//   const recoveryModule = computeRecoveryModuleAddress({
//     guardian,
//     recoveryPeriod,
//     saltNonce,
//     recoveryModuleMasterCopy,
//     deployer: safe
//   })

//   const waitForBalance = async () => {
//     const balance = await provider.getBalance(safe)

//     return new Promise(resolve => {
//       if (balance.gte(creationCosts)) {
//         resolve()
//       }
//       provider.on(safe, balance => {
//         if (balance.gte(creationCosts)) {
//           resolve()
//         }
//       })
//     })
//   }

//   const deploy = async () => {
//     return deployWallet({
//       owner,
//       saltNonce,
//       ensName,
//       guardian,
//       recoveryPeriod,
//       gasPrice,
//       ensDomain,
//       ensAddress,
//       apiHost,
//       jsonRpcUrl
//     })
//   }

//   return {
//     safe,
//     linkdropModule,
//     recoveryModule,
//     creationCosts: creationCosts.toString(),
//     waitForBalance,
//     deploy
//   }
// }

// /**
//  * Function to deploy new safe
//  * @param {String} owner Safe owner address
//  * @param {String} ensName ENS name to register
//  * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth')
//  * @param {String} ensAddress ENS address
//  * @param {String} data Creation data
//  * @param {String} gasPrice Gas price in wei
//  * @param {String} apiHost API host
//  * @param {String} jsonRpcUrl JSON RPC URL,
//  * @returns {Object} {success, txHash, errors}
//  */
// const deployWallet = async ({
//   owner,
//   saltNonce,
//   ensName,
//   guardian,
//   recoveryPeriod,
//   gasPrice,
//   ensDomain,
//   ensAddress,
//   apiHost,
//   jsonRpcUrl
// }) => {
//   try {
//     const ensOwner = await getEnsOwner({
//       ensName,
//       ensDomain,
//       ensAddress,
//       jsonRpcUrl
//     })
//     assert.true(ensOwner === ADDRESS_ZERO, 'Provided name already has an owner')

//     const response = await axios.post(`${apiHost}/api/v1/safes`, {
//       owner,
//       saltNonce,
//       ensName,
//       guardian,
//       recoveryPeriod,
//       gasPrice
//     })

//     const {
//       success,
//       txHash,
//       safe,
//       linkdropModule,
//       recoveryModule,
//       errors
//     } = response.data

//     return {
//       success,
//       txHash,
//       safe,
//       linkdropModule,
//       recoveryModule,
//       errors
//     }
//   } catch (err) {
//     return { success: false, errors: err.message || err }
//   }
// }
