import axios from 'axios'
import {
  generateEncryptionKey,
  generateIV,
  getPasswordDerivedKey,
  getPasswordHash,
  getPasswordDerivedKeyHash,
  getEncryptedEncryptionKey,
  getEncryptedMnemonic,
  extractEncryptionKey
} from './cryptoUtils'

import { ethers } from 'ethers'

export const signup = async ({ email, password, apiHost }) => {
  const encryptionKey = generateEncryptionKey()
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

  const response = await axios.post(`${apiHost}/api/v1/accounts/signup`, {
    email,
    passwordHash,
    passwordDerivedKeyHash,
    encryptedEncryptionKey,
    encryptedMnemonic
  })

  const { account, jwt, sessionKey, success, error } = response.data
  const sessionKeyStore = await wallet.encrypt(sessionKey)

  return {
    success,
    data: { privateKey: wallet.privateKey, sessionKeyStore },
    error
  }
}

export const login = async ({ email, password, apiHost }) => {
  const passwordDerivedKey = await getPasswordDerivedKey(email, password)
  const passwordHash = await getPasswordHash(email, password)

  const response = await axios.post(`${apiHost}/api/v1/accounts/login`, {
    email,
    passwordHash
  })

  const {
    encryptedEncryptionKey,
    encryptedMnemonic,
    jwt,
    success,
    error
  } = response.data

  const encryptionKey = await extractEncryptionKey(
    encryptedEncryptionKey.encryptedEncryptionKey,
    encryptedEncryptionKey.iv,
    passwordDerivedKey
  )
  console.log('encryptionKey: ', encryptionKey)

  console.log({
    encryptedEncryptionKey,
    encryptedMnemonic,
    jwt,
    success,
    error
  })
}
