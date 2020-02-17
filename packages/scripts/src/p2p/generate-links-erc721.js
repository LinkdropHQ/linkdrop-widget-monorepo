import WalletSDK from '../../../sdk/src'
import { AddressZero } from 'ethers/constants'
import {
  PRIVATE_KEY,
  LINKDROP_MODULE_ADDRESS,
  NFT_ADDRESS,
  TOKEN_IDS
} from '../../config/config.json'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
const walletSDK = new WalletSDK({ apiHost: 'http://lovalhost:5050' })

const main = async () => {
  const links = []
  const tokenIds = JSON.parse(TOKEN_IDS)

  for (let i = 0; i < tokenIds.length; i++) {
    const {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await walletSDK.generateLinkERC721({
      signingKeyOrWallet: PRIVATE_KEY,
      linkdropModuleAddress: LINKDROP_MODULE_ADDRESS,
      weiAmount: 10,
      nftAddress: NFT_ADDRESS,
      tokenId: tokenIds[i],
      expirationTime: 12345678910
    })
    const link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  const dir = path.join(__dirname, '../../output')
  const filename = path.join(dir, 'linkdrop_erc721P2P.csv')

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    const ws = fs.createWriteStream(filename)

    fastcsv.write(links, { headers: true }).pipe(ws)

    console.log(`Generated and saved links to ${filename}`)
  } catch (err) {
    throw new Error(err)
  }
}
main()
