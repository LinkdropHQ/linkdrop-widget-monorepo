import axios from 'axios'
import {
  generateEncryptionKey,
  generateIV,
  getPasswordDerivedKey,
  getPasswordHash,
  getPasswordDerivedKeyHash,
  getEncryptedEncryptionKey,
  getEncryptedMnemonic,
  extractEncryptionKey,
  extractMnemonic
} from './cryptoUtils'

import { ethers } from 'ethers'

export const register = async ({ email, password, apiHost }) => {
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

  const response = await axios.post(`${apiHost}/api/v1/accounts/register`, {
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
    sessionKey,
    success,
    error
  } = response.data

  const encryptionKey = await extractEncryptionKey(
    encryptedEncryptionKey.encryptedEncryptionKey,
    encryptedEncryptionKey.iv,
    passwordDerivedKey
  )

  const mnemonic = await extractMnemonic(
    encryptedMnemonic.encryptedMnemonic,
    encryptedMnemonic.iv,
    encryptionKey
  )

  const wallet = ethers.Wallet.fromMnemonic(mnemonic)

  const sessionKeyStore = await wallet.encrypt(sessionKey)

  return {
    success,
    data: { privateKey: wallet.privateKey, sessionKeyStore },
    error
  }
}

// @TODO Change path to the endpoint
export const extractPrivateKeyFromSession = async ({
  email,
  sessionKeyStore,
  apiHost
}) => {
  const sessionKey = await axios.get(`${apiHost}/api/v1/session/${email}`)
  const wallet = ethers.Wallet.fromEncryptedJson(sessionKeyStore, sessionKey)
  return wallet.privateKey
}
