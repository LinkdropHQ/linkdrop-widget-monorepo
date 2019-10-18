import config from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'
import capitalize from '../capitalize'

export default ({ chainId }) => {
  const networkName = defineNetworkName({ chainId })
  return config[`apiHostWallet${capitalize({ string: networkName })}`]
}
