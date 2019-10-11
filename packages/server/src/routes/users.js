import express from 'express'
import * as usersController from '../controllers/users'

const router = express.Router()

/**
 * @route POST api/v1/users
 * @desc Create new account
 * @access Public
 */
router.post('/', usersController.create)

/**
 * @route PUT api/v1/users
 * @desc Update existing account
 * @access Public
 */
router.put('/', usersController.update)

/**
 * @route POST api/v1/users/login
 * @desc Login user
 * @access Public
 */
// router.post('/login', usersController.login)

export default router
