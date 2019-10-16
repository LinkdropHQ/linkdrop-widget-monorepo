import mongoose from 'mongoose'
import relayerWalletService from '../services/relayerWalletService'
import { ethers } from 'ethers'

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
    encryptedEncryptionKey: { type: Object, required: true },
    encryptedMnemonic: { type: Object, required: true },
    deployed: { type: Boolean, required: true, default: false },
    ens: { type: String },
    owner: { type: String },
    saltNonce: { type: String },
    safe: { type: String },
    linkdropModule: { type: String },
    recoveryModule: { type: String },
    createSafeData: { type: String },
    sessionKey: {
      type: String,
      unique: true,
      default: () => ethers.Wallet.createRandom().privateKey
    }
  },
  {
    timestamps: true
  }
)

const Account = mongoose.model('Account', AccountSchema)

export default Account
