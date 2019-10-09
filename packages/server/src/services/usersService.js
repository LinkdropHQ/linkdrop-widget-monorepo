import { User, Account } from '../models'
import logger from '../utils/logger'

class UsersService {
  async findByEmail (email) {
    return User.findOne({ email })
  }

  async find ({ email, chain, saltNonce }) {
    return User.findOne({ email, chain, saltNonce })
  }

  async update ({
    email,
    chain,
    encryptedMnemonic,
    ens,
    safe,
    linkdropModule,
    recoveryModule,
    saltNonce,
    deployed
  }) {}

  async create ({
    email,
    chain,
    encryptedMnemonic,
    ens,
    safe,
    linkdropModule,
    recoveryModule,
    saltNonce,
    deployed
  }) {
    try {
      const account = new Account({
        chain,
        encryptedMnemonic,
        ens,
        safe,
        linkdropModule,
        recoveryModule,
        saltNonce,
        deployed
      })

      logger.debug('Creating new account..')
      logger.json(account)

      await account.save()
      logger.info(`Account created: ${account.ens}`)

      let user = await this.findByEmail(email)

      // If user does not exist in database
      if (!user) {
        logger.debug('Creating new user..')
        user = new User({ email, accounts: [account._id] })
        logger.json(user)
        await user.save()
        return user
      }
      // If user exists in database
      logger.debug('Updating existing user..')
      user.accounts.push(account._id)
      logger.json(user)
      await user.save()
      return user
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }
}

export default new UsersService()
