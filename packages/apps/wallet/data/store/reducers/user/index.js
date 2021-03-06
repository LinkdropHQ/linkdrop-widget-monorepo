import reducers from './reducers'
import config from 'app.config.js'
import { getHashVariables } from '@linkdrop/commons'
import { defineInitialData } from 'helpers'
const ls = (typeof window === 'undefined' ? {} : window).localStorage
const {
  chainId = config.defaultChainId
} = getHashVariables()
const { sessionKeyStore, email } = defineInitialData({ chainId })

const initialState = {
  id: undefined,
  locale: 'en',
  email,
  step: 0,
  loading: false,
  errors: [],
  readyToClaim: false,
  alreadyClaimed: false,
  sdk: null,
  sdkOriginal: null,
  privateKey: null,
  // надо null
  sessionKeyStore,
  avatar: ls && ls.getItem && ls.getItem('avatar'),
  showNote: true,
  chainId,
  wallet: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.CHANGE_LOCALE': reducers.changeLocale,
  'USER.SET_STEP': reducers.setStep,
  'USER.SET_LOADING': reducers.setLoading,
  'USER.SET_ERRORS': reducers.setErrors,
  'USER.SET_READY_TO_CLAIM': reducers.setReadyToClaim,
  'USER.SET_ALREADY_CLAIMED': reducers.setAlreadyClaimed,
  'USER.SET_SDK': reducers.setSdk,
  'USER.SET_SDK_ORIGINAL': reducers.setSdkOriginal,
  'USER.SET_PRIVATE_KEY': reducers.setPrivateKey,
  'USER.SET_USER_DATA': reducers.setUserData,
  'USER.TOGGLE_NOTE': reducers.toggleNote,
  'USER.SET_CHAIN_ID': reducers.setChainId,
  'USER.SET_EMAIL': reducers.setEmail,
  'USER.SET_WALLET': reducers.setWallet
}
