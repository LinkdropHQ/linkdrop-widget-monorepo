import express from 'express'
import * as safesControllerP2P from '../controllers/safesP2P'

const router = express.Router()

/**
 * @route POST api/v1/safesP2P/claimAndCreateP2P
 * @desc Claim linkdrop, create new safe and initialize it with ens name
 * @access Public
 */
router.post('/claimAndCreateP2P', safesControllerP2P.claimAndCreateP2P)

/**
 * @route POST api/v1/safesP2P/claimAndCreateERC721P2P
 * @desc Claim linkdrop, create new safe and initialize it with ens name
 * @access Public
 */
router.post(
  '/claimAndCreateERC721P2P',
  safesControllerP2P.claimAndCreateERC721P2P
)

export default router
