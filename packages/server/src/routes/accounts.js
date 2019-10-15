import express from 'express'
import * as accountsController from '../controllers/accounts'

const router = express.Router()

router.get('/exists/:email', accountsController.exists)

/**
 * @route POST api/v1/accounts/signup
 * @desc Signup new account
 * @access Public
 */
router.post('/signup', accountsController.signup)

/**
 * @route PUT api/v1/accounts/update
 * @desc Update existing account
 * @access Public
 */
router.put('/update', accountsController.update)

/**
 * @route POST api/v1/accounts/login
 * @desc Login existing acccount
 * @access Public
 */
// router.post('/login', accountsController.login)

export default router
