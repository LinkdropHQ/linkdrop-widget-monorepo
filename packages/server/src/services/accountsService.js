import { User, Account } from '../models'
import uuid from 'uuid'
import logger from '../utils/logger'

class AccountsService {
  async findByEmail (email) {
    return User.findOne({ email })
  }

  async create ({
    email,
    chain,
    encryptedMnemonic,
    ens,
    safe,
    linkdropModule,
    recoveryMOdule,
    deployed
  }) {
    try {
      const account = new Account({
        chain,
        encryptedMnemonic,
        ens,
        safe,
        linkdropModule,
        recoveryMOdule,
        deployed
      })

      logger.debug('Creating new account.. ')
      logger.json(account)

      await account.save()
      logger.info(`Account created: ${account.ens}`)
      return account
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }

  async createUser ({
    email,
    chain,
    encryptedMnemonic,
    ens,
    safe,
    linkdropModule,
    recoveryMOdule,
    deployed
  }) {
    try {
      const account = this.createAccount({
        chain,
        encryptedMnemonic,
        ens,
        safe,
        linkdropModule,
        recoveryMOdule,
        deployed
      })

      let user = this.findByEmail(email)
      if (!user) {
        // Create new user
        user = new User({ email, account })
      }

      return user
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }

  async update ({ address, email, name, nonce }) {
    try {
      const user = await this.find(address)
      if (!user) {
        throw new Error('User not found')
      }

      if (email) user.email = email
      if (name) user.name = name
      if (nonce) user.nonce = nonce

      logger.debug('Updating user.. ')
      logger.json(user)

      await user.save()
      logger.info(`User updated: ${user.address}`)
      return user
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }

  async updateNonce (address) {
    return this.update({
      address,
      nonce: uuid.v4()
    })
  }

  async verifySignature ({ address, signature }) {
    try {
      let message = `Signing my address ${address} for registration`

      const user = await this.find(address)
      if (user) {
        message = `Signing my one time nonce ${user.nonce} for authorisation`
      }
      const signer = utils.verifyMessage(message, signature)
      return signer === address
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }
}

export default new UsersService()
