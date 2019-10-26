import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import safeCreationService from '../services/safeCreationService'

export const create = wrapAsync(async (req, res, next) => {
  try {
    const {
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice,
      createAndAddModulesSafeTxData,
      email
    } = req.body
    assert.string(owner, 'Owner address is required')
    assert.string(saltNonce, 'Salt nonce is required')
    assert.string(ensName, 'Ens name is required')
    assert.string(guardian, 'Guardian address is required')
    assert.string(recoveryPeriod, 'Recovery period is required')
    assert.string(gasPrice, 'Gas price is required')
    assert.string(
      createAndAddModulesSafeTxData,
      'Create and add modules safe tx data is required'
    )
    assert.string(email, 'Email is required')

    const {
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    } = await safeCreationService.create({
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice,
      createAndAddModulesSafeTxData,
      email
    })

    res.json({
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export const claimAndCreate = wrapAsync(async (req, res, next) => {
  try {
    const {
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
    } = req.body

    assert.string(owner, 'Owner address is required')
    assert.string(saltNonce, 'Salt nonce is required')
    assert.string(ensName, 'Ens name is required')
    assert.string(guardian, 'Guardian address is required')
    assert.string(recoveryPeriod, 'Recovery period is required')
    assert.string(gasPrice, 'Gas price is required')

    assert.string(weiAmount, 'Wei amount is required')
    assert.string(tokenAddress, 'Token address is required')
    assert.string(tokenAmount, 'Token amount is required')
    assert.string(expirationTime, 'Expiration time is required')
    assert.string(linkId, 'Link id is required')
    assert.string(linkdropMasterAddress, 'Linkdrop master address is requred')
    assert.string(campaignId, 'Campaign id is required')
    assert.string(
      linkdropSignerSignature,
      'Linkdrop signer signature is required'
    )
    assert.string(receiverSignature, 'Receiver signature is required')
    assert.string(email, 'Email is required')
    assert.string(
      createAndAddModulesSafeTxData,
      'Create and add modules safe tx data is required'
    )

    const {
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    } = await safeCreationService.claimAndCreate({
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

    res.json({
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export const claimAndCreateERC721 = wrapAsync(async (req, res, next) => {
  try {
    const {
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverSignature,
      email,
      createAndAddModulesSafeTxData
    } = req.body

    assert.string(owner, 'Owner address is required')
    assert.string(saltNonce, 'Salt nonce is required')
    assert.string(ensName, 'Ens name is required')
    assert.string(guardian, 'Guardian address is required')
    assert.string(recoveryPeriod, 'Recovery period is required')
    assert.string(gasPrice, 'Gas price is required')

    assert.string(weiAmount, 'Wei amount is required')
    assert.string(nftAddress, 'Nft address is required')
    assert.string(tokenId, 'Token id is required')
    assert.string(expirationTime, 'Expiration time is required')
    assert.string(linkId, 'Link id is required')
    assert.string(linkdropMasterAddress, 'Linkdrop master address is requred')
    assert.string(campaignId, 'Campaign id is required')
    assert.string(
      linkdropSignerSignature,
      'Linkdrop signer signature is required'
    )

    assert.string(receiverSignature, 'Receiver signature is required')

    assert.string(email, 'Email is required')
    assert.string(
      createAndAddModulesSafeTxData,
      'Create and add modules safe tx data is required'
    )

    const {
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    } = await safeCreationService.claimAndCreateERC721({
      owner,
      saltNonce,
      ensName,
      guardian,
      recoveryPeriod,
      gasPrice,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverSignature,
      email,
      createAndAddModulesSafeTxData
    })

    res.json({
      success,
      txHash,
      safe,
      linkdropModule,
      recoveryModule,
      errors
    })
  } catch (err) {
    next(err)
  }
})
