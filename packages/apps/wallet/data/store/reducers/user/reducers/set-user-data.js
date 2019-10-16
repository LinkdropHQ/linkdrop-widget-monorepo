export default (state, { payload: { privateKey, sessionKeyStore, avatar, email } }) => ({ ...state, privateKey, sessionKeyStore, email, avatar })
