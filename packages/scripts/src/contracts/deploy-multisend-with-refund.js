import { ethers } from 'ethers'
import MultiSendWithRefund from '../../contracts/build/MultiSendWithRefund.json'
import {
  CHAIN,
  INFURA_API_TOKEN,
  PRIVATE_KEY,
  GAS_PRICE_GWEI
} from '../config/config.json'

const jsonRpcUrl = `https://${CHAIN}.infura.io/v3/${INFURA_API_TOKEN}`
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

const deploy = async () => {
  console.log('Deploying multisend with refund library...')

  const multiSendWithRefundFactory = new ethers.ContractFactory(
    MultiSendWithRefund.abi,
    MultiSendWithRefund.bytecode,
    deployer
  )

  const multiSendWithRefund = await multiSendWithRefundFactory.deploy({
    gasPrice: ethers.utils.parseUnits(GAS_PRICE_GWEI, 'gwei'),
    gasLimit: 6900000
  })

  console.log(
    'MultiSendWithRefund library deployed at: ',
    multiSendWithRefund.address
  )
  console.log('Tx hash:', multiSendWithRefund.deployTransaction.hash)
}

deploy()
