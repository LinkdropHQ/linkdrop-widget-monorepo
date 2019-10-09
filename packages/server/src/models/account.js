import mongoose from 'mongoose'
const Schema = mongoose.Schema

const AccountSchema = new Schema(
  {
    chain: { type: String, required: true },
    encryptedMnemonic: { type: String, required: true },
    ens: { type: String, required: true },
    safe: { type: String, required: true },
    linkdropModule: { type: String },
    recoveryModule: { type: String },
    saltNonce: { type: String },
    deployed: { type: Boolean, required: true }
  },
  {
    timestamps: true
  }
)

const Account = mongoose.model('Account', AccountSchema)

export default Account
