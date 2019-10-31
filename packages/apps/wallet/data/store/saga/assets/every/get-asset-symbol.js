export default function * ({ contract, tokenAddress }) {
  try {
    return yield contract.symbol()
  } catch (error) {
    console.error(error)
    if (tokenAddress.toLowerCase() === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359') {
      return 'DAI'
    }
    return 'ERC20'
  }
}
