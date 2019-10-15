import express from 'express'
import * as accountsController from '../controllers/accounts'

const router = express.Router()

router.get('/exists/:email', accountsController.accountExists)

/**
 * @route POST api/v1/accounts
 * @desc Create new account
 * @access Public
 */
router.post('/', accountsController.create)

/**
 * @route PUT api/v1/accounts
 * @desc Update existing account
 * @access Public
 */
router.put('/', accountsController.update)

/**
 * @route POST api/v1/accounts/login
 * @desc Login user
 * @access Public
 */
router.post('/login', accountsController.login)

export default router
