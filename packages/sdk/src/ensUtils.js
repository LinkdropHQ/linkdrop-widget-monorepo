import { ENS } from '@ensdomains/ens'
import { ethers } from 'ethers'
import assert from 'assert-js'

/**
 * Function to get owner of ENS identifier
 * @param {String} ensName ENS name (e.g 'alice')
 * @param {String} ensDomain ENS domain (e.g. 'domain.eth')
 * @param {String} ensAddress ENS address
 * @param {String} jsonRpcUrl JSON RPC URL
 * @return {String} ENS identifier owner's address
 */
export const getEnsOwner = async ({
  ensName,
  ensDomain,
  ensAddress,
  jsonRpcUrl
}) => {
  assert.string(ensDomain, 'Ens domain is required')
  assert.url(jsonRpcUrl, 'Json rpc url is required')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  if (!ensAddress) {
    ensAddress = (await provider.getNetwork()).ensAddress
  }

  assert.string(ensAddress, 'Ens address is required')

  const ens = new ethers.Contract(ensAddress, ENS.abi, provider)
  const node = ethers.utils.namehash(`${ensName}${ensDomain}`)
  return ens.owner(node)
}

export const getEnsAddress = chain => {
  assert.string(chain, 'Chain is required')

  switch (chain) {
    case 'mainnet':
      return '0x314159265dd8dbb310642f98f50c066173c1259b'
    case 'rinkeby':
      return '0xe7410170f87102df0055eb195163a03b7f2bff4a'
    case 'ropsten':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010'
    case 'goerli':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010'
    default:
      throw new Error('Unsupported chain')
  }
}
