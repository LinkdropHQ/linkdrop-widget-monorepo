import path from 'path'
import csvToJson from 'csvtojson'
import queryString from 'query-string'
import WalletSDK from '../../sdk/src'

export const getUrlParams = async (type, i) => {
  const csvFilePath = path.resolve(__dirname, `../output/linkdrop_${type}.csv`)
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
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId
  } = await getUrlParams('eth', 4)

  const ensName = Math.random()
    .toString(36)
    .substring(2, 15)

  const email = 'amiromayer@gmail.com'

  const saltNonce = new Date().getTime().toString()
  console.log('ensName: ', ensName)
  console.log('email: ', email)
  console.log('saltNonce: ', saltNonce)

  const {
    safe,
    linkdropModule,
    recoveryModule,
    success,
    txHash,
    creationCosts,
    errors
  } = await walletSDK.claimAndCreate({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId,
    owner: '0x6748e86bC4943ce1E6134F78cb4c9557a71AB4f2',
    ensName,
    saltNonce,
    gasPrice: '4000000000', // 4 gwei
    email,
    privateKey: ''
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
