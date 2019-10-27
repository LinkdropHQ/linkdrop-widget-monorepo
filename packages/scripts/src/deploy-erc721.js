import { PRIVATE_KEY, SAFE_ADDRESS, CHAIN } from '../config/config.json'
import NFTMock from '../../contracts/build/NFTMock.json'
import { ethers } from 'ethers'

const main = async () => {
  const provider = ethers.getDefaultProvider(CHAIN)
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider)
  const nftFactory = new ethers.ContractFactory(
    NFTMock.abi,
    NFTMock.bytecode,
    deployer
  )

  const nftContract = await nftFactory.deploy(SAFE_ADDRESS, {
    gasPrice: ethers.utils.parseUnits('10', 'gwei')
  })

  console.log('nftContract: ', nftContract.address)

  console.log('Tx hash:', nftContract.deployTransaction.hash)
}

main()
