import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    accounts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
    ]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', UserSchema)

export default User
