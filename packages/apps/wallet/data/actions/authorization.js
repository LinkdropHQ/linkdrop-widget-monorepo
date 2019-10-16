class Authorization {
  constructor (actions) {
    this.actions = actions
  }

  // verifyEmail ({ code }) {
  //   this.actions.dispatch({ type: '*AUTHORIZATION.VERIFY_EMAIL', payload: { code } })
  // }

  setErrors ({ errors }) {
    this.actions.dispatch({ type: '*AUTHORIZATION.SET_ERRORS', payload: { errors } })
  }

  signInWithGoogle () {
    this.actions.dispatch({ type: '*AUTHORIZATION.SIGN_IN_WITH_GOOGLE' })
  }

  enableGDrivePermissions () {
    this.actions.dispatch({ type: '*AUTHORIZATION.ENABLE_GDRIVE_PERMISSIONS' })
  }

  syncDataWithDrive () {
    this.actions.dispatch({ type: '*AUTHORIZATION.SYNC_DATA_WITH_DRIVE' })
  }

  checkEmail ({ email }) {
    // checking if email was registered previously
    this.actions.dispatch({ type: '*AUTHORIZATION.CHECK_EMAIL', payload: { email } })
  }

  signUp ({ email, password }) {
    // sign up, if email wasn't found in DB
    this.actions.dispatch({ type: '*AUTHORIZATION.SIGN_UP', payload: { email, password } })
  }

  signIn ({ email, password }) {
    // sign in, if email wasn found in DB
    this.actions.dispatch({ type: '*AUTHORIZATION.SIGN_IN', payload: { email, password } })
  }

  setScreen ({ screen }) {
    this.actions.dispatch({ type: 'AUTHORIZATION.SET_SCREEN', payload: { screen } })
  }
}

export default Authorization
