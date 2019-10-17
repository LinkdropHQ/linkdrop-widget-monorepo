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

  const response = await axios.post(
    `${apiHost}/api/v1/accounts/register`,
    {
      email,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonic
    },
    {
      withCredentials: true
    }
  )

  const { account, sessionKey, success, error } = response.data

  const sessionKeyStore = await wallet.encrypt(sessionKey)

  return {
    success,
    data: { privateKey: wallet.privateKey, sessionKeyStore },
    error
  }
}

export const login = async ({ email, password, apiHost }) => {
  const passwordHash = await getPasswordHash(email, password)

  const response = await axios.post(
    `${apiHost}/api/v1/accounts/login`,
    {
      email,
      passwordHash
    },
    { withCredentials: true }
  )

  const {
    encryptedEncryptionKey,
    encryptedMnemonic,
    sessionKey,
    success,
    error
  } = response.data

  const passwordDerivedKey = await getPasswordDerivedKey(email, password)
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

export const fetchSessionKey = async apiHost => {
  const response = await axios.get(
    `${apiHost}/api/v1/accounts/fetch-session-key`,
    {
      withCredentials: true
    }
  )
  const { success, sessionKey, error } = response.data
  return { success, sessionKey, error }
}

export const extractPrivateKeyFromSession = async ({
  sessionKeyStore,
  apiHost
}) => {
  const { success, sessionKey, error } = await fetchSessionKey(apiHost)
  let wallet
  if (success === true) {
    wallet = ethers.Wallet.fromEncryptedJson(sessionKeyStore, sessionKey)
  }
  return { success, privateKey: wallet.privateKey, error }
}

export const isDeployed = async ({ email, apiHost }) => {
  const response = await axios.get(
    `${apiHost}/api/v1/accounts/is-deployed/${email}`
  )
  return response.data
}
