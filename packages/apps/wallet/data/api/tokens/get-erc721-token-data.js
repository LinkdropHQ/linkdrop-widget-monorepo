import fetch from '../fetch'

export default ({ erc721URL }) => {
  // if ipfs hash
  if (erc721URL.indexOf('http') < 0 && erc721URL.length === 46) {
    erc721URL = 'https://storage.snark.art/ipfs/' + erc721URL
  }
  
  // change ipfs:// -> https://ipfs.io/ipfs if it's in the url
  if (erc721URL.substring(0, 7) === 'ipfs://') {
     erc721URL = 'https://storage.snark.art/ipfs/' + erc721URL.substring(7)
  }
  return fetch(erc721URL)
}
