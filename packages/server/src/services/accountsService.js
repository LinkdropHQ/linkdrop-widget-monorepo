import { User, Account } from '../models'
import logger from '../utils/logger'
import sdkService from './sdkService'
import relayerWalletService from './relayerWalletService'
const { PROXY_FACTORY_ADDRESS } = '../../config/config.json'

class AccountsService {
  // Each email should have only one account per chain
  async findUser (email) {
    return User.findOne({ email }).populate('accounts')
  }

  async findAccount ({ email, chain }) {
    return Account.findOne({ email, chain })
  }

  async login ({ email, passwordHash }) {
    try {
      const user = await this.findUser({ email, passwordHash })
      if (user) {
        logger.debug('Found existing user')
        logger.json(user)

        return {
          encryptedEncryptionKey: user.encryptedEncryptionKey,
          encryptedPrivateKey: user.encryptedPrivateKey
        }
      }
    } catch (err) {
      logger.error(err)
    }
  }

  /**
    email: { type: String, required: true, unique: true },
    chain: { type: String, required: true },
    ens: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordDerivedKeyHash: { type: String, required: true },
    encryptedEncryptionKey: { type: String, required: true },
    encryptedMnemonic: { type: String, required: true, unique: true },
    owner: { type: String, required: true, unique: true },
    saltNonce: { type: String, required: true },
    safe: { type: String, required: true, unique: true },
    linkdropModule: { type: String, unique: true },
    recoveryModule: { type: String, unique: true },
    deployed: { type: Boolean, required: true }
   */

  async create ({
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
    createSafeData,
    deployed
  }) {
    try {
      const account = new Account({
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
        createSafeData,
        deployed
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

  async update ({ email, chain, deployed }) {
    const account = await this.findAccount({ email, chain })

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
