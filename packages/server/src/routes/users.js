import express from 'express'
import * as usersController from '../controllers/users'

const router = express.Router()

/**
 * @route POST api/v1/users
 * @desc Create new user
 * @access Public
 */
router.post('/', usersController.create)

/**
 * @route POST api/v1/users/login
 * @desc Login user
 * @access Public
 */
// router.post('/login', usersController.login)

export default router
