import WalletSDK from '../../../sdk/src'
import { AddressZero } from 'ethers/constants'
import { PRIVATE_KEY, LINKDROP_MODULE_ADDRESS } from '../../config/config.json'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
const walletSDK = new WalletSDK({ apiHost: 'http://lovalhost:5050' })

const main = async () => {
  const links = []

  for (let i = 0; i < 10; i++) {
    const {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await walletSDK.generateLink({
      signingKeyOrWallet: PRIVATE_KEY,
      linkdropModuleAddress: LINKDROP_MODULE_ADDRESS,
      weiAmount: 10e4,
      tokenAddress: AddressZero,
      tokenAmount: 0,
      expirationTime: 12345678910
    })
    const link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  const dir = path.join(__dirname, '../../output')
  const filename = path.join(dir, 'linkdrop_ethP2P.csv')

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    const ws = fs.createWriteStream(filename)
    console.log('het')
    fastcsv.write(links, { headers: true }).pipe(ws)
    console.log(`Generated and saved links to ${filename}`)
  } catch (err) {
    throw new Error(err)
  }
}
main()
