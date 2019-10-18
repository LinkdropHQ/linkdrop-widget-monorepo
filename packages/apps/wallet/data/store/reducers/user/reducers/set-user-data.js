export default (state, { payload: { wallet, privateKey, sessionKeyStore, avatar, email } }) => ({ ...state, privateKey, wallet, sessionKeyStore, email, avatar })
