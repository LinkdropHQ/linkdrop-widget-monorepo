/* global gapi */
import { put } from 'redux-saga/effects'

const generator = function * () {
  try {
    const authInstance = gapi.auth2.getAuthInstance()
    const isSignedIn = authInstance.isSignedIn.get()
    if (!isSignedIn) {
      throw new Error('User not signed in')
    }
    const user = authInstance.currentUser.get()
    const email = user.getBasicProfile().getEmail()
    const avatar = user.getBasicProfile().getImageUrl()
    return { email, avatar }
  } catch (e) {
    console.error(e)
  }
}

export default generator
