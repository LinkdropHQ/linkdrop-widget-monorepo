import { ethers } from 'ethers'
import LinkdropModule from '../../../contracts/build/LinkdropModule.json'
import {
  CHAIN,
  INFURA_API_TOKEN,
  PRIVATE_KEY,
  GAS_PRICE_GWEI
} from '../../config/config.json'

const jsonRpcUrl = `https://${CHAIN}.infura.io/v3/${INFURA_API_TOKEN}`
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

const deploy = async () => {
  console.log('Deploying linkdrop module...')

  const linkdropModuleFactory = new ethers.ContractFactory(
    LinkdropModule.abi,
    LinkdropModule.bytecode,
    deployer
  )

  const linkdropModule = await linkdropModuleFactory.deploy({
    gasPrice: ethers.utils.parseUnits(GAS_PRICE_GWEI, 'gwei'),
    gasLimit: 6900000
  })

  console.log('Linkdrop Module deployed at: ', linkdropModule.address)
  console.log('Tx hash:', linkdropModule.deployTransaction.hash)
}

deploy()
