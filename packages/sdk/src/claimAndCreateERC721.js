import axios from 'axios'
import assert from 'assert-js'
import { ethers } from 'ethers'
import { signReceiverAddress } from './utils'
import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
import { computeRecoveryModuleAddress } from './computeRecoveryModuleAddress'
import { precomputeSafeAddressWithModules } from './precomputeSafeAddressWithModules'
import { getEnsOwner } from './ensUtils'

const ADDRESS_ZERO = ethers.constants.AddressZero

/**
 * Function to create new safe and claim linkdrop
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress Nft address
 * @param {String} tokenId Token id
 * @param {String} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key assigned to link
 * @param {String} linkdropMasterAddress Linkdrop master address
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} campaignId Campaign id
 * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
 * @param {String} proxyFactory Deployed proxy factory address
 * @param {String} owner Safe owner address
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
export const claimAndCreateERC721 = async ({
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  campaignId,
  gnosisSafeMasterCopy,
  proxyFactory,
  owner,
  linkdropModuleMasterCopy,
  createAndAddModules,
  multiSend,
  apiHost,
  saltNonce,
  guardian,
  recoveryPeriod,
  recoveryModuleMasterCopy,
  ensName,
  ensDomain,
  ensAddress,
  jsonRpcUrl,
  email
}) => {
  assert.string(weiAmount, 'Wei amount is required')
  assert.string(nftAddress, 'Nft address is required')
  assert.string(tokenId, 'Token id is required')
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
  assert.string(apiHost, 'Api host is required')
  assert.string(ensName, 'Ens name is required')
  assert.string(saltNonce, 'Salt nonce is required')
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

  const safeAddress = precomputeSafeAddressWithModules({
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
  })
  
  const receiverSignature = await signReceiverAddress(linkKey, safeAddress)
  const linkId = new ethers.Wallet(linkKey).address

  const linkdropModule = computeLinkdropModuleAddress({
    owner,
    saltNonce,
    linkdropModuleMasterCopy,
    deployer: safeAddress
  })

  const recoveryModule = computeRecoveryModuleAddress({
    guardian,
    recoveryPeriod,
    saltNonce,
    recoveryModuleMasterCopy,
    deployer: safeAddress
  })

  const response = await axios.post(
    `${apiHost}/api/v1/safes/claimAndCreateERC721`,
    {
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice: '0',
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverSignature,
      email
    }
  )

  const { success, txHash, errors } = response.data

  return {
    success,
    txHash,
    linkdropModule,
    recoveryModule,
    safeAddress,
    creationCosts: 0,
    errors
  }
}
