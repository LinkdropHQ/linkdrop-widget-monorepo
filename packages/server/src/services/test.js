import crypto from 'crypto'

// STEP 1
const email = 'amir@mail.com'
const password = 'password'

// STEP 2
const encryptionKey = crypto.randomBytes(64)
console.log('encryptionKey: ', encryptionKey.toString('hex'))

// STEP 3
const passwordDerivedKey = crypto.pbkdf2Sync(
  password, // secret
  email, // salt
  100000, // number off KDF iterations to run
  32, // key length
  'sha256'
)
console.log('passwordDerivedKey', passwordDerivedKey.toString('hex'))

const algorithm = 'aes-256-cbc'
const iv = crypto.randomBytes(16)
console.log('iv: ', iv.toString('hex'))

const cipher = crypto.createCipheriv(algorithm, passwordDerivedKey, iv)
const decipher = crypto.createDecipheriv(algorithm, passwordDerivedKey, iv)

const encryptedEncryptionKey =
  cipher.update(encryptionKey, 'utf8', 'hex') + cipher.final('hex')
console.log('encryptedEncryptionKey: ', encryptedEncryptionKey)

// STEP 4
const passwordHash = crypto.pbkdf2Sync(
  passwordDerivedKey, // secret
  password, // salt
  1, // number off KDF iterations to run
  32, // key length
  'sha256'
)
console.log('passwordHash: ', passwordHash.toString('hex'))

// STEP 5
const passwordDerivedKeyHash = crypto
  .createHash('sha512')
  .update(passwordDerivedKey)
  .digest('hex')
console.log('passwordDerivedKeyHash: ', passwordDerivedKeyHash)

// STEP 6

const {
  publicKey: assymetricPublicKey,
  privateKey: encryptedAssymetricPrivateKey
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
    passphrase: encryptionKey.toString('hex')
  }
})
console.log('assymetricPublicKey: ', assymetricPublicKey)
console.log('encryptedAssymetricPrivateKey: ', encryptedAssymetricPrivateKey)

// const privK = {
//   key: encryptedAssymetricPrivateKey,
//   passphrase: encryptionKey.toString('hex')
// }

// const encrypted = crypto.privateEncrypt(privK, Buffer.from('Plain Text'))
// console.log('encrypted: ', encrypted.toString('hex'))

// STEP 7

// Save all data encrypted in database

const toSave = {
  kdf: 'pbkdf2',
  kdfIterations: 100000,
  email,
  passwordHash: passwordHash.toString('hex'),
  passwordDerivedKeyHash,
  encryptedEncryptionKey,
  assymetricPublicKey,
  encryptedAssymetricPrivateKey
}
console.log('toSave: ', toSave)

// LOGIN

// STEP 1 (Obtain passwordDerivedKey)
