import { User, Account } from '../models'
import logger from '../utils/logger'
import sdkService from './sdkService'
import relayerWalletService from './relayerWalletService'
import { PROXY_FACTORY_ADDRESS } from '../../config/config.json'

class AccountsService {
  // Each email should have only one account per chain
  async findUser (email) {
    if (email == null) {
      return
    }
    return User.findOne({ email }).populate('accounts')
  }

  async findAccount (email) {
    if (email == null) {
      return
    }
    return Account.findOne({ email, chain: relayerWalletService.chain })
  }

  async create ({
    email,
    passwordHash,
    passwordDerivedKeyHash,
    encryptedEncryptionKey,
    encryptedMnemonic
  }) {
    try {
      const account = new Account({
        email,
        passwordHash,
        passwordDerivedKeyHash,
        encryptedEncryptionKey,
        encryptedMnemonic
      })

      logger.debug('Creating new account..')
      logger.json(account)

      await account.save()
      logger.info(
        `Created new account for ${account.email} on ${account.chain} network`
      )

      let user = await this.findUser(email)

      // If user does not exist in database
      if (!user) {
        logger.debug('Creating new user..')
        user = new User({
          email,
          accounts: [account._id]
        })
        logger.json(user)
        await user.save()
        logger.info('User succesfully created')
        return account
      }

      // If user exists in database
      logger.debug('Updating existing user..')
      user.accounts.push(account._id)
      logger.json(user)
      await user.save()
      logger.info('User succesfully updated')

      return account
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }

  async estimateCreationCosts ({ createSafeData, gasPrice }) {
    const estimate = (await relayerWalletService.provider.estimateGas({
      to: PROXY_FACTORY_ADDRESS,
      data: createSafeData,
      gasPrice
    })).add(9000)

    const creationCosts = estimate.mul(gasPrice)
    return creationCosts
  }

  async update ({ email, deployed }) {
    const account = await this.findAccount({ email })

    if (deployed) {
      account.deployed = deployed
    }
    logger.debug(
      `Updating account ${account.email} on ${account.chain} network`
    )
    await account.save()

    logger.info('Account successfully updated')
    return account
  }
}

export default new AccountsService()
