export default function * ({ contract, tokenAddress }) {
  try {
    return yield contract.decimals()
  } catch (error) {
    console.error(error)
    if (tokenAddress.toLowerCase() === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359') {
      return 18
    }
    return 0
  }
}
