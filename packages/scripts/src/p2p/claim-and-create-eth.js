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
  } = await getUrlParams('ethP2P', 1)

  const ensName = Math.random()
    .toString(36)
    .substring(2, 15)

  const {
    safe,
    linkdropModule,
    recoveryModule,
    success,
    txHash,
    creationCosts,
    errors
  } = await walletSDK.claimAndCreateP2P({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    ensName,
    gasPrice: '0', // 4 gwei
    email: EMAIL,
    privateKey: PRIVATE_KEY
  })

  console.log({
    safe,
    linkdropModule,
    recoveryModule,
    success,
    txHash,
    creationCosts: creationCosts.toString(),
    errors
  })
}
main()
