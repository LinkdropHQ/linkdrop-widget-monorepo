import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import accountsService from '../services/accountsService'
import authService from '../services/authService'

export const exists = wrapAsync(async (req, res, next) => {
  try {
    const email = req.params.email
    const account = await accountsService.findAccount(email)
    res.send(!!account)
  } catch (err) {
    next(err)
  }
})

export const update = wrapAsync(async (req, res, next) => {
  try {
    const { email, deployed } = req.body

    let account = await accountsService.findAccount(email)

    if (!account) {
      return next(boom.badRequest('Account does not exist'))
    }

    account = await accountsService.update({
      email,
      deployed
    })

    const token = await authService.getToken(email)

    res.json({ account, token })
  } catch (err) {
    logger.error(err)
  }
})

export const register = wrapAsync(async (req, res, next) => {
  try {
    const {
      email,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonic
    } = req.body

    assert.string(email, 'Email is required')
    assert.string(passwordHash, 'Password hash is required')
    assert.string(
      passwordDerivedKeyHash,
      'Password derived key hash is required'
    )
    assert.object(
      encryptedEncryptionKey,
      'Encrypted encryption key is required'
    )
    assert.object(encryptedMnemonic, 'Encrypted mnemonic is required')

    let account = await accountsService.findAccount(email)

    if (account) {
      return next(boom.badRequest('Account already exists'))
    }

    account = await accountsService.create({
      email,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonic
    })

    const jwt = await authService.getToken(account._id)
    const sessionKey = await authService.getSessionKey(email)

    // set cookie
    const cookieConfig = {
      httpOnly: true, // to disable accessing cookie via client side js
      // secure: true, // to force https (if you use it)
      maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
      signed: true // if you use the secret with cookieParser
    }
    res.cookie('jwt', jwt, cookieConfig)
    res.json({ account, sessionKey, success: true })
  } catch (err) {
    next(err)
  }
})

export const login = wrapAsync(async (req, res, next) => {
  try {
    const { email, passwordHash } = req.body

    const account = await accountsService.findAccount(email)

    if (!account) {
      return next(boom.badRequest('No account found'))
    }

    if (account.passwordHash !== passwordHash) {
      return next(boom.badRequest('Invalid password'))
    }

    const jwt = await authService.getToken(email)
    const sessionKey = await authService.getSessionKey(email)

    res.json({
      encryptedEncryptionKey: account.encryptedEncryptionKey,
      encryptedMnemonic: account.encryptedMnemonic,
      jwt,
      sessionKey,
      success: true
    })
  } catch (err) {
    next(err)
  }
})
