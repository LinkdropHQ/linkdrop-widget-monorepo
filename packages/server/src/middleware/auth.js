import jwt from 'jsonwebtoken'
import boom from '@hapi/boom'
import wrapAsync from '../utils/asyncWrapper'
import { JWT_SECRET } from '../../config/config.json'

export default wrapAsync(async (req, res, next) => {
  const token = req.header('auth-token')

  if (!token) {
    return next(boom.unauthorized('No token, authorisation denied'))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('decoded: ', decoded)
    req.account = decoded.account
    next()
  } catch (err) {
    next(boom.badRequest(err.message))
  }
})
