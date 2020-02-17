import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'
import { openseaApiKey } from 'app.config.js'

export default ({ address, networkName, orderBy = 'current_price', direction = 'asc' }) => {
  const getParams = prepareGetParams({
    owner: address,
    order_by: orderBy,
    order_direction: direction
  })
  const domainName = networkName === 'rinkeby' ? 'rinkeby-api.opensea.io' : 'api.opensea.io'
  return fetch(`https://${domainName}/api/v1/assets/${getParams}`, {
    headers: {
      'X-API-KEY': openseaApiKey
    }
  })
}
