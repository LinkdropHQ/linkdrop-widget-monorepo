import jwt from 'jsonwebtoken'
import logger from '../utils/logger'
import accountsService from './accountsService'
import { JWT_SECRET } from '../../config/config.json'

class AuthService {
  async getSessionKey (email) {
    try {
      const account = await accountsService.findAccount(email)

      if (!account) throw new Error('Account not found')

      return account.sessionKey
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }

  async getJWT (accountId) {
    try {
      return jwt.sign({ accountId }, JWT_SECRET, {
        expiresIn: 360000
      })
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }

  async decodeJWT (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log('decoded: ', decoded)
      return decoded.accountId
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }
}

export default new AuthService()
