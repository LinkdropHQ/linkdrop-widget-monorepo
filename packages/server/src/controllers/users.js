import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import usersService from '../services/usersService'

export const update = wrapAsync(async (req, res, next) => {
  try {
    const { email, chain, deployed } = req.body

    let account = await usersService.findAccount({ email, chain })

    if (!account) {
      return next(boom.badRequest('Account does not exist'))
    }

    account = await usersService.update({
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
      chain,
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
      deployed
    } = req.body

    let account = await usersService.findAccount({ email, chain })

    if (account) {
      return next(boom.badRequest('Account already exists'))
    }

    account = await usersService.create({
      email,
      chain,
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
      deployed
    })

    res.json({ account })
  } catch (err) {
    next(err)
  }
})
