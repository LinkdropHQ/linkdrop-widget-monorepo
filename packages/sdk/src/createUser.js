import {
  getPasswordHash,
  getPasswordDerivedKeyHash,
  getEncryptedEncryptionKey,
  getEncryptedMnemonic
} from './cryptoUtils'

const createUser = async ({
  email,
  password,
  encryptionKey,
  publicKey,
  encryptedPrivateKey,
  mnemonic,
  chain,
  apiHost
}) => {
  const passwordHash = await getPasswordHash(email, password)
  const passwordDerivedKeyHash = await getPasswordDerivedKeyHash(
    email,
    password
  )

  const encryptedEncryptionKey = await getEncryptedEncryptionKey(
    email,
    password,
    encryptionKey
  )

  const encryptedMnemonic = await getEncryptedMnemonic(
    email,
    password,
    mnemonic
  )

  //   const publicKey
  //   encryptedPrivateKey,
  //   chain,
  //   encryptedMnemonic,
  ens, safe, linkdropModule, recoveryModule, saltNonce, deployed
}
