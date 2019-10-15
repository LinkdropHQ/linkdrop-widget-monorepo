import axios from 'axios'
import {
  generateEncryptionKey,
  generateIV,
  getPasswordDerivedKey,
  getPasswordHash,
  getPasswordDerivedKeyHash,
  getEncryptedEncryptionKey,
  getEncryptedMnemonic
} from './cryptoUtils'

import { computeSafeAddress } from './computeSafeAddress'

export const signup = async ({
  email,
  password,
  apiHost,
  ensDomain,
  deployer,
  gnosisSafeMastercopy
}) => {
  const encryptionKey = generateEncryptionKey()
  const passwordDerivedKey = await getPasswordDerivedKey(email, password)
  const encryptedEncryptionKey = await getEncryptedEncryptionKey(
    email,
    password,
    encryptionKey
  )
  const passwordHash = await getPasswordHash(email, password)
  const passwordDerivedKeyHash = await getPasswordDerivedKeyHash(
    email,
    password
  )

  const wallet = ethers.Wallet.createRandom()
  const mnemonic = wallet.mnemonic
  const iv = generateIV()

  const encryptedMnemonic = await getEncryptedMnemonic(
    mnemonic,
    encryptionKey,
    iv
  )

  const response = await axios.post(`${apiHost}/api/v1/accounts`, {
    email,
    passwordHash,
    passwordDerivedKeyHash,
    encryptedEncryptionKey,
    encryptedMnemonic
  })

  const { account, jwt, sessionKey } = response.data

  /*
          Generate mnemonic
          hash password -> passwordHash
          Encrypt mnemonic with passwordHash
          save email, passwordHash to server db

          receive JWT and sessionKey from server
          add JWT to cookies
          encrypt mnemonic with sessionKey -> sessionKeystore
          return { success, data, errors }, where data is { privateKey, sessionKeystore }
         */

  const wallet = ethers.Wallet.createRandom()
  const mnemonic = wallet.mnemonic
  console.log('mnemonic: ', mnemonic)

  const encryptedWallet = await wallet.encrypt(password)
  console.log('encryptedWallet: ', encryptedWallet)

  // const encryptedMnemonic = await this.cryptoUtils.getEncryptedMnemonic(
  //   mnemonic,
  //   key,
  //   iv
  // )
  // console.log('encryptedMnemonic: ', encryptedMnemonic)
}
