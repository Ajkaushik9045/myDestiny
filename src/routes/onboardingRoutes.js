import express from 'express'
import {
    registerUser,
    loginUser,
    resetPassword,
} from '../controllers/onboardingControllers.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/reset-password', authMiddleware, resetPassword)

export default router
