import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'

// JWT Secret Key (Use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

// Register a new user
const registerUser = async (req, res) => {
    const { userName, email, phoneNumber, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            userName,
            email,
            phoneNumber,
            password: hashedPassword,
            leetCodeCount: 0,
            streak: 0,
            totalLectureCount: 0,
        })

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '7d',
        })

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
        })
    }
}

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '7d',
        })

        res.status(200).json({ message: 'Login successful', token, user })
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message,
        })
    }
}

// Reset password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({ message: 'Password reset successful' })
    } catch (error) {
        res.status(500).json({
            message: 'Error resetting password',
            error: error.message,
        })
    }
}

export { registerUser, loginUser, resetPassword }
