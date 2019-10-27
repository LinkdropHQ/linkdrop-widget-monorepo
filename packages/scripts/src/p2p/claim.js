import path from 'path'
import csvToJson from 'csvtojson'
import queryString from 'query-string'
import WalletSDK from '../../../sdk/src'

import { PRIVATE_KEY, EMAIL } from '../../config/config.json'

export const getUrlParams = async (type, i) => {
  const csvFilePath = path.resolve(
    __dirname,
    `../../output/linkdrop_${type}.csv`
  )
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url.replace('#', '')
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}

const walletSDK = new WalletSDK({ apiHost: 'http://localhost:5050' })

const main = async () => {
  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature
  } = await getUrlParams('ethP2P', 0)

  const {
    success,
    txHash,

    errors
  } = await walletSDK.claimERC721({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress: '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A'
  })

  console.log({
    success,
    txHash,
    errors
  })
}
main()
