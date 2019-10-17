import fetch from '../fetch'
import { getApiHost } from 'helpers'

export default ({ email, chainId }) => {
  const apiHost = getApiHost({ chainId })
  return fetch(`${apiHost}/api/v1/accounts/exists/${email}`)
}
