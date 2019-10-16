export default (state, { payload: { privateKey, email, sessionKeyStore, avatar } }) => ({ ...state, privateKey, sessionKeyStore, email, avatar })
