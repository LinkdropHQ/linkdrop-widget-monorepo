import tokens from './tokens'
import assets from './assets'
import user from './user'
import widget from './widget'
import authorization from './authorization'

function * saga () {
  yield * tokens()
  yield * assets()
  yield * user()
  yield * widget()
  yield * authorization()
}

export default saga
