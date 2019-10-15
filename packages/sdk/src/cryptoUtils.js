import crypto from 'crypto'

/**
 * Generates random encryption key of size 64 bytes
 * @return `encryptionKey` Encryption key
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(64).toString('hex')
}

/**
 * Generates random initializatin vector of size 16 bytes
 * @return `iv` Initialization vector
 */
export const generateIV = () => {
  return crypto.randomBytes(16)
}

/**
 * Encrypts `encryptionKey` using AES-CBC algorithm with password derived key as the secret and 16 random bytes as the IV
 * @param {String} email Email
 * @param {String} password Password
 * @param {String} encryptionKey Encryption key
 * @return `{encryptedEncryptionKey, iv}`
 */
export const getEncryptedEncryptionKey = async (
  email,
  password,
  encryptionKey
) => {
  const passwordDerivedKey = await getPasswordDerivedKey(email, password)
  const iv = generateIV()
  const cipher = crypto.createCipheriv('aes-256-cbc', passwordDerivedKey, iv)

  const encryptedEncryptionKey =
    cipher.update(encryptionKey, 'utf8', 'hex') + cipher.final('hex')

  return { encryptedEncryptionKey, iv }
}

/**
 * Encrypts `mnemonic` using AES-CBC algorithm with `encryptionKey` as the secret and 16 bytes IV
 * @param {String} mnemonic Mnemonic
 * @return `{encryptedMnemonic, iv}`
 */
export const getEncryptedMnemonic = async (mnemonic, encryptionKey, iv) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv)

  const encryptedMnemonic =
    cipher.update(mnemonic, 'utf8', 'hex') + cipher.final('hex')

  return { encryptedMnemonic, iv }
}

export const extractEncryptionKey = async (
  encryptedEncryptionKey,
  iv,
  passwordDerivedKey
) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    passwordDerivedKey,
    iv
  )
  return (
    decipher.update(encryptedEncryptionKey, 'utf8', 'hex') +
    decipher.final('hex')
  )
}

/**
 * Derives password derived key
 * @param {String} email Email
 * @param {String} password Password
 * @return `passwordDerivedKey` Password derived key
 */
export const getPasswordDerivedKey = async (email, password) => {
  return crypto
    .pbkdf2Sync(password, email, 100000, 32, 'sha256')
    .toString('hex')
}

/**
 * Derives password hash
 * @param {String} email Email
 * @param {String} password Password
 * @return `passwordHash` Password hash
 */
export const getPasswordHash = async (email, password) => {
  const passwordDerivedKey = await getPasswordDerivedKey(email, password)
  return crypto
    .pbkdf2Sync(passwordDerivedKey, password, 1, 32, 'sha256')
    .toString('hex')
}

/**
 * Hashes password derived key
 * @param {String} email Email
 * @param {String} password Password
 * @return `passwordDerivedKeyHash` Password derived key hash
 */
export const getPasswordDerivedKeyHash = async (email, password) => {
  const passwordDerivedKey = await getPasswordDerivedKey(email, password)
  return crypto
    .createHash('sha512')
    .update(passwordDerivedKey)
    .digest('hex')
}

/**
 * Generates assymetric key pair and encrypts private key with `encryptionKey` as passphrase
 * @param {String} encryptionKey Encryption key
 * @return `{publicKey, encryptedPrivateKey}` Public key and encrypted private key in pem format
 */
export const getEncryptedAssymetricKeyPair = async encryptionKey => {
  const {
    publicKey,
    privateKey: encryptedPrivateKey
  } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: encryptionKey
    }
  })
  return { publicKey, encryptedPrivateKey }
}
