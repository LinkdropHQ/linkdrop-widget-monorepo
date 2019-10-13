import jwt from 'jsonwebtoken'
import logger from '../utils/logger'
import accountsService from './accountsService'
import relayerWalletService from './relayerWalletService'
import { JWT_SECRET } from '../../config/config.json'

class AuthService {
  async getToken (email) {
    try {
      const account = await accountsService.findAccount({
        email,
        chain: relayerWalletService.chain
      })

      if (!account) throw new Error('Account not found')

      const payload = { account: { email } }

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: 360000
      })

      logger.debug(`Signed new JWT token for ${email}`)
      return token
    } catch (err) {
      logger.error(err)
      throw new Error(err.message)
    }
  }
}

export default new AuthService()
