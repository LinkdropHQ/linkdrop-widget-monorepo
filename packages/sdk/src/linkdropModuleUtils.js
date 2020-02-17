import LinkdropModule from '@linkdrop-widget/contracts/build/LinkdropModule.json'
import { ethers } from 'ethers'

export const isClaimedLink = async ({ linkdropModule, linkId, jsonRpcUrl }) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropModuleContract = new ethers.Contract(
    linkdropModule,
    LinkdropModule.abi,
    provider
  )
  return linkdropModuleContract.isClaimedLink(linkId)
}
