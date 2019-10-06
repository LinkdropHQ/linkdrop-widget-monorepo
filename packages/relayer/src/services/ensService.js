import assert from 'assert-js'
import { ethers } from 'ethers'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import { ENS_ADDRESS, ENS_DOMAIN } from '../../config/config.json'
import relayerWalletService from './relayerWalletService'
import sdkService from './sdkService'

class ENSService {
  constructor () {
    assert.string(ENS_ADDRESS, 'ENS address is required')
    assert.string(ENS_DOMAIN, 'ENS domain is required')

    this.ens = new ethers.Contract(
      ENS_ADDRESS,
      ENS.abi,
      relayerWalletService.wallet
    )
    this.ensDomain = ENS_DOMAIN
  }

  async getOwner (ensName) {
    return sdkService.walletSDK.getEnsOwner({
      ensName,
      ensAddress: this.ens.address,
      ensDomain: this.ensDomain,
      jsonRpcUrl: relayerWalletService.jsonRpcUrl
    })
  }

  async getRegistrarContract () {
    const registrar = await this.getOwner(this.ensDomain)
    return new ethers.Contract(
      registrar,
      FIFSRegistrar.abi,
      relayerWalletService.provider
    )
  }
}

export default new ENSService()
