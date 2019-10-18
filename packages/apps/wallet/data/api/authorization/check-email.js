import fetch from '../fetch'
import { getApiHostWallet } from 'helpers'

export default ({ email, chainId }) => {
  const apiHost = getApiHostWallet({ chainId })
  return fetch(`${apiHost}/api/v1/accounts/exists/${email}`)
}
