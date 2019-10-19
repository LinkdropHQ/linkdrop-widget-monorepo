import { ethers } from 'ethers'
import {
  encodeParams,
  encodeDataForMultiSend,
  getParamFromTxEvent,
  encodeDataForCreateAndAddModules
} from './utils'
import { computeSafeAddress } from './computeSafeAddress'
import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
import { computeRecoveryModuleAddress } from './computeRecoveryModuleAddress'
import { precomputeSafeAddressWithModules } from './precomputeSafeAddressWithModules'
import { claimAndCreate } from './claimAndCreate'
import { claimAndCreateERC721 } from './claimAndCreateERC721'
import { signTx } from './signTx'
import { executeTx } from './executeTx'
import { getEnsOwner, getEnsAddress } from './ensUtils'
import { generateLink, generateLinkERC721 } from './generateLink'
import { claim, claimERC721 } from './claim'
import {
  register,
  login,
  extractPrivateKeyFromSession,
  isDeployed
} from './accounts'

import * as cryptoUtils from './cryptoUtils'

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

class WalletSDK {
  constructor ({
    chain = 'rinkeby',
    apiHost = `https://${chain}-wallet-api.linkdrop.io`,
    claimHost = 'https://claim.linkdrop.io',
    jsonRpcUrl,
    gnosisSafeMasterCopy = '0xB945Bd4b447aF21C5B55eF859242829FBDc0bF0A', // custom version with ERC721 receiving support
    proxyFactory = '0x12302fE9c02ff50939BaAaaf415fc226C078613C',
    linkdropModuleMasterCopy = '0xB74bBDb7830b7845b73184958Cd00B341C6644C9',
    createAndAddModules = '0x1a56aE690ab0818aF5cA349b7D21f1d7e76a3d36',
    multiSend = '0xD4B7B161E4779629C2717385114Bf78D612aEa72',
    recoveryModuleMasterCopy = '0xD3FaECC16097E96986F868220185F6470A3F1eA9',
    recoveryPeriod = '259200', // 3 days
    ensAddress = getEnsAddress(chain),
    ensDomain = 'linkdrop.test',
    guardian = '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A',
    linkdropFactory = '0xBa051891B752ecE3670671812486fe8dd34CC1c8'
  }) {
    this.chain = chain
    this.jsonRpcUrl =
      jsonRpcUrl ||
      `https://${chain}.infura.io/v3/4e820e3654994281ba2a14e3f7a224b2`
    this.apiHost = apiHost
    this.claimHost = claimHost
    this.gnosisSafeMasterCopy = gnosisSafeMasterCopy
    this.proxyFactory = proxyFactory
    this.linkdropModuleMasterCopy = linkdropModuleMasterCopy
    this.createAndAddModules = createAndAddModules
    this.multiSend = multiSend
    this.recoveryModuleMasterCopy = recoveryModuleMasterCopy
    this.recoveryPeriod = recoveryPeriod
    this.ensAddress = ensAddress
    this.ensDomain = ensDomain
    this.guardian = guardian
    this.linkdropFactory = linkdropFactory
    this.cryptoUtils = cryptoUtils
  }

  /**
   * @dev Function to get encoded params data from contract abi
   * @param {Object} abi Contract abi
   * @param {String} method Function name
   * @param {Array<T>} params Array of function params to be encoded
   * @return Encoded params data
   */
  encodeParams (abi, method, params) {
    return encodeParams(abi, method, params)
  }

  /**
   * Function to get encoded data to use in MultiSend library
   * @param {Number} operation
   * @param {String} to
   * @param {Number} value
   * @param {String} data
   */
  encodeDataForMultiSend (operation, to, value, data) {
    return encodeDataForMultiSend(operation, to, value, data)
  }

  /**
   * Function to get specific param from transaction event
   * @param {Object} tx Transaction object compatible with ethers.js library
   * @param {String} eventName Event name to parse param from
   * @param {String} paramName Parameter to be retrieved from event log
   * @param {Object} contract Contract instance compatible with ethers.js library
   * @return {String} Parameter parsed from transaction event
   */
  async getParamFromTxEvent (tx, eventName, paramName, contract) {
    return getParamFromTxEvent(tx, eventName, paramName, contract)
  }

  /**
   * Function to calculate the safe address based on given params
   * @param {String} owner Safe's owner
   * @param {String} to To (optional)
   * @param {String} data Data (optional)
   * @param {String} paymentToken Payment token (0x0 for ether) (optional)
   * @param {String} paymentAmount Payment amount (optional)
   * @param {String} paymentReceiver Payment receiver (optional)
   */
  computeSafeAddress ({
    owner,
    to = ADDRESS_ZERO,
    data = BYTES_ZERO,
    paymentToken = ADDRESS_ZERO,
    paymentAmount = 0,
    paymentReceiver = ADDRESS_ZERO
  }) {
    return computeSafeAddress({
      owner,
      saltNonce: owner,
      deployer: this.proxyFactory,
      gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
      to,
      data,
      paymentToken,
      paymentAmount,
      paymentReceiver
    })
  }

  /**
   * Function to execute safe transaction
   * @param {String} safe Safe address
   * @param {String} privateKey Safe owner's private key
   * @param {String} to To
   * @param {Number} value Value
   * @param {String} data Data (optional)
   * @param {Number} operation Operation (optional)
   * @param {Number} safeTxGas Safe tx gas (optional)
   * @param {Number} baseGas Base gas (optional)
   * @param {Number} gasPrice Gas price (optional)
   * @param {String} gasToken Gas token (optional)
   * @param {String} refundReceiver Refund receiver (optional)
   * @param {String} apiHost API host (optional)
   * @param {String} jsonRpcUrl JSON RPC URL (optional)
   * @returns {Object} {success, txHash, errors}
   */
  async executeTx ({
    safe,
    privateKey,
    to,
    value,
    data = '0x',
    operation = 0,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000',
    apiHost = this.apiHost,
    jsonRpcUrl = this.jsonRpcUrl
  }) {
    return executeTx({
      apiHost,
      jsonRpcUrl,
      safe,
      privateKey,
      to,
      value,
      data,
      operation,
      gasToken,
      refundReceiver
    })
  }

  /**
   * Function to sign safe transaction
   * @param {String} safe Safe address
   * @param {String} privateKey Safe owner's private key
   * @param {String} to To
   * @param {Number} value Value
   * @param {String} data Data (optional)
   * @param {Number} operation Operation (optional)
   * @param {Number} safeTxGas Safe tx gas (optional)
   * @param {Number} baseGas Base gas (optional)
   * @param {Number} gasPrice Gas price (optional)
   * @param {String} gasToken Gas token (optional)
   * @param {String} refundReceiver Refund receiver (optional)
   * @param {Number} nonce Safe's nonce
   * @returns {String} Signature
   */
  signTx ({
    safe,
    privateKey,
    to,
    value,
    data = '0x',
    operation = 0,
    safeTxGas = 0,
    baseGas = 0,
    gasPrice = 0,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000',
    nonce
  }) {
    return signTx({
      safe,
      privateKey,
      to,
      value,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce
    })
  }

  /**
   * Function to get owner of ENS identifier
   * @param {String} ensName ENS name (e.g 'alice')
   * @param {String} ensDomain ENS domain (e.g. 'my-domain.eth') (optional)
   * @param {String} ensAddress ENS address (optional)
   * @param {String} jsonRpcUrl JSON RPC URL (optional)
   * @return {String} ENS identifier owner's address
   */
  async getEnsOwner ({
    ensName,
    ensDomain = this.ensDomain,
    ensAddress = this.ensAddress,
    jsonRpcUrl = this.jsonRpcUrl
  }) {
    return getEnsOwner({ ensName, ensDomain, ensAddress, jsonRpcUrl })
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
   * @param {String} owner Safe owner address
   * @param {String} ensName ENS name (e.g. 'alice')
   * @param {String} email Email
   * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
   */
  async claimAndCreate ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId,
    owner,
    ensName,
    email
  }) {
    return claimAndCreate({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId,
      owner,
      saltNonce: owner,
      ensName,
      gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
      proxyFactory: this.proxyFactory,
      linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
      createAndAddModules: this.createAndAddModules,
      multiSend: this.multiSend,
      apiHost: this.apiHost,
      guardian: this.guardian,
      recoveryPeriod: this.recoveryPeriod,
      recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
      ensDomain: this.ensDomain,
      ensAddress: this.ensAddress,
      jsonRpcUrl: this.jsonRpcUrl,
      email
    })
  }

  /**
   * Function to create new safe and claim ERC721 linkdrop
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
   * @param {String} linkdropFactory Deployed linkdrop factory address
   * @param {String} email Email
   * @returns {Object} {success, txHash,safe, linkdropModule, recoveryModule, errors}
   */
  async claimAndCreateERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId,
    owner,
    ensName,
    email
  }) {
    return claimAndCreateERC721({
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId,
      owner,
      saltNonce: owner,
      ensName,
      gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
      proxyFactory: this.proxyFactory,
      linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
      createAndAddModules: this.createAndAddModules,
      multiSend: this.multiSend,
      apiHost: this.apiHost,
      guardian: this.guardian,
      recoveryPeriod: this.recoveryPeriod,
      recoveryModuleMasterCopy: this.recoveryModuleMasterCopy,
      ensDomain: this.ensDomain,
      ensAddress: this.ensAddress,
      jsonRpcUrl: this.jsonRpcUrl,
      linkdropFactory: this.linkdropFactory,
      email
    })
  }

  /**
   * Function to precompute Safe address with specific params and gas price 0
   * @param {String} owner Safe owner address
   * @returns {String} safeAddress
   */
  precomputeAddress ({ owner }) {
    return precomputeSafeAddressWithModules({
      owner,
      saltNonce: owner,
      gnosisSafeMasterCopy: this.gnosisSafeMasterCopy,
      proxyFactory: this.proxyFactory,
      linkdropModuleMasterCopy: this.linkdropModuleMasterCopy,
      createAndAddModules: this.createAndAddModules,
      multiSend: this.multiSend,
      guardian: this.guardian,
      recoveryPeriod: this.recoveryPeriod,
      recoveryModuleMasterCopy: this.recoveryModuleMasterCopy
    })
  }

  /**
   * Function to calculate the linkdrop module address based on given params
   * @param {String} owner Safe owner address
   * @param {String} saltNonce Random salt nonce
   * @param {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
   * @param {String} deployer Deployer address
   */
  computeLinkdropModuleAddress ({
    owner,
    saltNonce,
    linkdropModuleMasterCopy = this.linkdropModuleMasterCopy,
    deployer = this.proxyFactory
  }) {
    return computeLinkdropModuleAddress({
      owner,
      saltNonce,
      linkdropModuleMasterCopy,
      deployer
    })
  }

  /**
   * Function to calculate the recovery module address based on given params
   * @param {String} guardians Guardian address
   * @param {String} recoveryPeriod Recovery period duration in atomic value (seconds)
   * @param {String} saltNonce Random salt nonce
   * @param {String} recoveryModuleMasterCopy Deployed recovery module mastercopy address
   * @param {String} deployer Deployer address
   */
  computeRecoveryModuleAddress ({
    guardian,
    recoveryPeriod = this.recoveryPeriod,
    saltNonce,
    recoveryModuleMasterCopy = this.recoveryModuleMasterCopy,
    deployer = this.proxyFactory
  }) {
    return computeRecoveryModuleAddress({
      guardian,
      recoveryPeriod,
      saltNonce,
      recoveryModuleMasterCopy,
      deployer
    })
  }

  /**
   * Function to get encoded data to use in CreateAndAddModules library
   * @param {String} dataArray Data array concatenated
   */
  encodeDataForCreateAndAddModules (dataArray) {
    return encodeDataForCreateAndAddModules(dataArray)
  }

  /**
   * @description Function to generate link for ETH and/or ERC20
   * @param {String | Object} signingKeyOrWallet Signing key or wallet instances
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} weiAmount Wei amount
   * @param {String} tokenAddress Token address
   * @param {String} tokenAmount Amount of tokens
   * @param {String} expirationTime Link expiration timestamp
   */
  async generateLink ({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  }) {
    return generateLink({
      claimHost: this.claimHost,
      linkdropModuleAddress,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime
    })
  }

  /**
   * @description Function to generate link for ETH and/or ERC721
   * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} weiAmount Wei amount
   * @param {String} nftAddress NFT address
   * @param {String} tokenId Token id
   * @param {String} expirationTime Link expiration timestamp
   */
  async generateLinkERC721 ({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime
  }) {
    return generateLinkERC721({
      claimHost: this.claimHost,
      signingKeyOrWallet,
      linkdropModuleAddress,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime
    })
  }

  /**
   * @description Function to claim ETH and/or ERC20 tokens
   * @param {String} weiAmount Wei amount
   * @param {String} tokenAddress Token address
   * @param {String} tokenAmount Amount of tokens
   * @param {String} expirationTime Link expiration timestamp
   * @param {String} linkKey Ephemeral key attached to link
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} linkdropSignerSignature Linkdrop signer signature
   * @param {String} receiverAddress Receiver address
   */
  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claim({
      apiHost: this.apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }

  /**
   * @description Function to claim ETH and/or ERC721 tokens
   * @param {String} weiAmount Wei amount
   * @param {String} nftAddress NFT address
   * @param {String} tokenId Token id
   * @param {String} expirationTime Link expiration timestamp
   * @param {String} linkKey Ephemeral key attached to link
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} linkdropSignerSignature Linkdrop signer signature
   * @param {String} receiverAddress Receiver address
   */
  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claimERC721({
      apiHost: this.apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }

  /**
   * Registers new account in database
   * @param {String} email Email
   * @param {String} password Password
   */
  async register (email, password) {
    const ownerWallet = ethers.Wallet.createRandom()
    const walletAddress = this.precomputeAddress({ owner: ownerWallet.address })
    return register({
      email,
      password,
      apiHost: this.apiHost,
      ownerWallet,
      walletAddress
    })
  }

  /**
   * Logs existing account into system
   * @param {String} email Email
   * @param {String} password Password
   */
  async login (email, password) {
    return login({ email, password, apiHost: this.apiHost })
  }

  /**
   * Fetches session key from server, decrypts session keystore and returns private key
   * @param {Object} sessionKeyStore Encrypted session key store
   * @return `{success, privateKey, error}`
   */
  async extractPrivateKeyFromSession (sessionKeyStore) {
    return extractPrivateKeyFromSession({
      sessionKeyStore,
      apiHost: this.apiHost
    })
  }

  /**
   * Returns whether a wallet for the given account is deployed and safe address if exists
   * @param {String} email Email
   * @return `{isDeployed, safe}`
   */
  async isDeployed (email) {
    return isDeployed({ email, apiHost: this.apiHost })
  }
}

export default WalletSDK
