import express from 'express'
import * as accountsController from '../controllers/accounts'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/exists/:email', accountsController.exists)

router.get('/fetch-session-key', accountsController.fetchSessionKey)

/**
 * @route POST api/v1/accounts/register
 * @desc Signup new account
 * @access Public
 */
router.post('/register', accountsController.register)

/**
 * @route POST api/v1/accounts/login
 * @desc Login existing acccount
 * @access Public
 */
router.post('/login', accountsController.login)

export default router
