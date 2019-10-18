import { ethers } from 'ethers'
import GnosisSafe from '../../contracts/build/GnosisSafe.json'
import { CHAIN, INFURA_API_TOKEN, PRIVATE_KEY } from '../config/config.json'

const jsonRpcUrl = `https://${CHAIN}.infura.io/v3/${INFURA_API_TOKEN}`
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const deployer = new ethers.Wallet(PRIVATE_KEY, provider)

const deploy = async () => {
  console.log('Deploying gnosis safe...')

  const gnosisSafeFactory = new ethers.ContractFactory(
    GnosisSafe.abi,
    GnosisSafe.bytecode,
    deployer
  )

  const gnosisSafe = await gnosisSafeFactory.deploy()

  console.log('Gnosis Safe deployed at: ', gnosisSafe.address)
  console.log('Tx hash:', gnosisSafe.deployTransaction.hash)
}

deploy()
