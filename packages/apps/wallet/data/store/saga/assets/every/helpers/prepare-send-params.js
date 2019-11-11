import { defineNetworkName } from '@linkdrop/commons'
import { utils, ethers } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'

export default function * ({
  type,
  tokenAddress,
  amount,
  decimals,
  chainId,
  sdk,
  sendTo,
  privateKey,
  tokenId
}) {
  const networkName = defineNetworkName({ chainId })
  const provider = yield ethers.getDefaultProvider(networkName)
  const owner = new ethers.Wallet(privateKey).address
  const safe = sdk.precomputeAddress({ owner })
  switch (type) {
    case 'erc20': {
      const tokenContract = new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      const amountFormatted = utils.parseUnits(String(amount.trim()), decimals)
      const data = yield tokenContract.interface.functions.transfer.encode([sendTo, amountFormatted])

      return {
        safe,
        to: tokenAddress,
        data: data,
        value: '0',
        privateKey
      }
    }

    case 'erc721': {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        NFTMock.abi,
        provider
      )

      const data = yield tokenContract.interface.functions.safeTransferFrom.encode(
        [safe, sendTo, tokenId]
      )
      return {
        safe,
        to: tokenAddress,
        data,
        value: '0',
        privateKey
      }
    }

    case 'eth': {
      const amountFormatted = utils.parseEther(String(amount).trim())
      return {
        safe,
        to: sendTo,
        data: '0x',
        value: amountFormatted.toString(),
        privateKey
      }
    }
  }
}
