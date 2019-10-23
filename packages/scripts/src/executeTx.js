import WalletSDK from '../../sdk/src'
const walletSDK = new WalletSDK({ apiHost: 'http://localhost:5050' })

const main = async () => {
  const abi = ['function test() external']
  const data = walletSDK.encodeParams(abi, 'test', [])

  const { success, txHash, errors } = await walletSDK.executeTx({
    safe: '0x80a5443e3c037bff7ae9a0fa63709325af8239b4',
    privateKey: '',
    to: '0x5445B44F8ab4B7bAbebB482857f2F49b1AD31935',
    value: '0',
    data
  })

  console.log({ success, txHash, errors })
}

main()
