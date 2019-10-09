import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import usersService from '../services/usersService'

export const create = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/users/')
    logger.json(req.body, 'info')

    const {
      email,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      publicKey,
      encryptedPrivateKey,
      chain,
      encryptedMnemonic,
      ens,
      safe,
      linkdropModule,
      recoveryModule,
      saltNonce,
      deployed
    } = req.body

    let user = await usersService.find({ email, chain, ens })

    if (user) {
      return next(boom.badRequest('User already exists'))
    }

    user = await usersService.create({
      email,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      publicKey,
      encryptedPrivateKey,
      chain,
      encryptedMnemonic,
      ens,
      safe,
      linkdropModule,
      recoveryModule,
      saltNonce,
      deployed
    })

    res.json({ user })
  } catch (err) {
    next(err)
  }
})
