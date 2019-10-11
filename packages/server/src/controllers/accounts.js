import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import accountsService from '../services/accountsService'
import relayerWalletService from '../services/relayerWalletService'

export const update = wrapAsync(async (req, res, next) => {
  try {
    const { email, chain, deployed } = req.body

    let account = await accountsService.findAccount({ email, chain })

    if (!account) {
      return next(boom.badRequest('Account does not exist'))
    }

    account = await accountsService.update({
      email,
      chain,
      deployed
    })

    res.json({ account })
  } catch (err) {
    logger.error(err)
  }
})

export const create = wrapAsync(async (req, res, next) => {
  try {
    const {
      email,
      ens,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonicPhrase,
      owner,
      saltNonce,
      safe,
      linkdropModule,
      recoveryModule,
      createSafeData,
      deployed
    } = req.body

    let account = await accountsService.findAccount({
      email,
      chain: relayerWalletService.chain
    })

    if (account) {
      return next(boom.badRequest('Account already exists'))
    }

    account = await accountsService.create({
      email,
      ens,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonicPhrase,
      owner,
      saltNonce,
      safe,
      linkdropModule,
      recoveryModule,
      createSafeData,
      deployed
    })

    res.json({ account })
  } catch (err) {
    next(err)
  }
})
