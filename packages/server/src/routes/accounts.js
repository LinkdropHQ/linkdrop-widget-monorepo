import express from 'express'
import * as accountsController from '../controllers/accounts'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/exists/:email', accountsController.exists)

/**
 * @route POST api/v1/accounts/register
 * @desc Signup new account
 * @access Public
 */
router.post('/register', accountsController.register)

/**
 * @route PUT api/v1/accounts/update
 * @desc Update existing account
 * @access Public, only authenticated users
 */
router.put('/update', auth, accountsController.update)

/**
 * @route POST api/v1/accounts/login
 * @desc Login existing acccount
 * @access Public
 */
router.post('/login', accountsController.login)

export default router
