import mongoose from 'mongoose'
import relayerWalletService from '../services/relayerWalletService'
const Schema = mongoose.Schema

const AccountSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    chain: {
      type: String,
      required: true,
      default: relayerWalletService.chain
    },
    passwordHash: { type: String, required: true },
    passwordDerivedKeyHash: { type: String, required: true },
    encryptedEncryptionKey: { type: String, required: true },
    encryptedMnemonic: { type: String, required: true, unique: true },
    deployed: { type: Boolean, required: true, default: false },
    ens: { type: String, unique: true },
    owner: { type: String, unique: true },
    saltNonce: { type: String },
    safe: { type: String, unique: true },
    linkdropModule: { type: String, unique: true },
    recoveryModule: { type: String, unique: true },
    createSafeData: { type: String, unique: true }
  },
  {
    timestamps: true
  }
)

const Account = mongoose.model('Account', AccountSchema)

export default Account
