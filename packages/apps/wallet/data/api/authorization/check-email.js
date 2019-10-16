import fetch from '../fetch'
import config from 'app.config.js'

export default ({ email }) => fetch(`${config.apiHostRinkeby}/api/v1/accounts/exists/${email}`)
