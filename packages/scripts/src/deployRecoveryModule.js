import { ethers } from 'ethers'
import RecoveryModule from '../../contracts/build/RecoveryModule.json'
import { CHAIN, INFURA_API_TOKEN, PRIVATE_KEY } from '../config/config.json'

const jsonRpcUrl = `https://${CHAIN}.infura.io/v3/${INFURA_API_TOKEN}`
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

const deploy = async () => {
  console.log('Deploying recovery module...')

  const recoveryModuleFactory = new ethers.ContractFactory(
    RecoveryModule.abi,
    RecoveryModule.bytecode,
    deployer
  )

  const recoveryModule = await recoveryModuleFactory.deploy()

  console.log('Recovery Module deployed at: ', recoveryModule.address)
  console.log('Tx hash:', recoveryModule.deployTransaction.hash)
}

deploy()
