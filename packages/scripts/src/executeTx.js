import WalletSDK from '../../sdk/src'
const walletSDK = new WalletSDK({})

const main = async () => {
  const { success, txHash, errors } = await walletSDK.executeTx({
    safe: '0x80a5443e3c037bff7ae9a0fa63709325af8239b4',
    privateKey: '',
    to: '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A',
    value: '1'
  })

  console.log({ success, txHash, errors })
}

main()
