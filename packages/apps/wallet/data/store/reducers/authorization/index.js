import reducers from './reducers'

const initialState = {
  loading: false,
  screen: 'initial',
  errors: [],
  authorized: false
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'AUTHORIZATION.SET_LOADING': reducers.setLoading,
  'AUTHORIZATION.SET_SCREEN': reducers.setScreen,
  'AUTHORIZATION.SET_ERRORS': reducers.setErrors,
  'AUTHORIZATION.SET_AUTHORIZED': reducers.setAuthorized
}
