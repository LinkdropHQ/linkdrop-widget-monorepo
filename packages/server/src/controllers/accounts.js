import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import accountsService from '../services/accountsService'
import authService from '../services/authService'
import relayerWalletService from '../services/relayerWalletService'
import snarkArtService from '../services/snarkArtService'

export const exists = wrapAsync(async (req, res, next) => {
  try {
    const email = req.params.email
    const account = await accountsService.findAccount(email)
    res.send(!!account)
  } catch (err) {
    next(err)
  }
})

export const register = wrapAsync(async (req, res, next) => {
  try {
    const {
      email,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonic,
      walletAddress
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

    // register with snark art
    snarkArtService.register({ email, address: walletAddress })
    
    await _setCookie(account._id, res)
    const sessionKey = await authService.getSessionKey(email)

    // set cookie
    res.json({ account, sessionKey, success: true })
  } catch (err) {
    next(err)
  }
})

const _setCookie = async (accountId, res) => {
  const jwt = await authService.getJWT(accountId)
  const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    // secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true // if you use the secret with cookieParser
  }

  res.cookie('LINKDROP_WIDGET_JWT', jwt, cookieConfig)
}

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

    await _setCookie(account._id, res)
    const sessionKey = await authService.getSessionKey(email)

    res.json({
      encryptedEncryptionKey: account.encryptedEncryptionKey,
      encryptedMnemonic: account.encryptedMnemonic,
      sessionKey,
      success: true
    })
  } catch (err) {
    next(err)
  }
})

export const fetchSessionKey = wrapAsync(async (req, res, next) => {
  try {
    const signedCookies = req.signedCookies // get signed cookies
    if (!signedCookies.LINKDROP_WIDGET_JWT) {
      return next(boom.badRequest('No JWT token in cookies'))
    }

    try {
      const accountId = await authService.decodeJWT(
        signedCookies.LINKDROP_WIDGET_JWT
      )
      console.log({ accountId })
      const account = await accountsService.findById(accountId)
      return res.json({
        success: true,
        sessionKey: account.sessionKey
      })
    } catch (err) {
      next(boom.badRequest(err.message))
    }

    res.json({
      success: false
    })
  } catch (err) {
    next(err)
  }
})

export const isDeployed = wrapAsync(async (req, res, next) => {
  try {
    const account = await accountsService.findAccount(req.params.email)
    if (account && account.safe) {
      const code = await relayerWalletService.provider.getCode(account.safe)
      return res.json({ isDeployed: code !== '0x', safe: account.safe })
    }
    res.json({ isDeployed: false })
  } catch (err) {
    next(err)
  }
})
