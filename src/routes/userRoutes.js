import express from 'express'
import {
    userDetails,
    updateUserDetails,
    changePassword,
} from '../controllers/userControllers.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
    getAllUsers,
    streakUpdate,
} from '../controllers/userScoreControllers.js'

const router = express.Router()

router.get('/profile', authMiddleware, userDetails)
router.post('/update-user', authMiddleware, updateUserDetails)
router.post('/change-password', authMiddleware, changePassword)
router.post('/streak', authMiddleware, streakUpdate)
router.get('/getUsers', authMiddleware, getAllUsers)

export default router
