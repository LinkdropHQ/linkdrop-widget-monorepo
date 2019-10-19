import WalletSDK from '../../../sdk/src/index'
import { CHAIN, ENS_DOMAIN } from '../../config/config.json'
import assert from 'assert-js'

class SDKService {
  constructor () {
    assert.string(CHAIN, 'Chain is required')
    assert.string(ENS_DOMAIN, 'Ens domain is required')
    this.walletSDK = new WalletSDK({
      chain: CHAIN,
      ensDomain: ENS_DOMAIN
    })
  }
}

export default new SDKService()
