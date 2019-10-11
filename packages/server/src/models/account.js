import mongoose from 'mongoose'
const Schema = mongoose.Schema

const AccountSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    chain: { type: String, required: true },
    ens: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordDerivedKeyHash: { type: String, required: true },
    encryptedEncryptionKey: { type: String, required: true },
    encryptedMnemonicPhrase: { type: String, required: true, unique: true },
    owner: { type: String, required: true, unique: true },
    saltNonce: { type: String, required: true },
    safe: { type: String, required: true, unique: true },
    linkdropModule: { type: String, unique: true },
    recoveryModule: { type: String, unique: true },
    createSafeData: { type: String, required: true, unique: true },
    deployed: { type: Boolean, required: true }
  },
  {
    timestamps: true
  }
)

const Account = mongoose.model('Account', AccountSchema)

export default Account
