export default function * ({ tokenId, nftContract }) {
  try {
    return yield nftContract.tokenURI(tokenId)
  } catch (err) {
    console.error(err)
    return ''
  }
}
