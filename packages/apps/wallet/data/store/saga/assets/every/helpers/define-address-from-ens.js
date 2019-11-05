import { convertEns } from './'

export default function * ({ to, provider }) {
  let address = to
  if (to.indexOf('.') > -1) {
    address = yield convertEns({ ens: to, provider })
  }
  return address
}
