import User from '../models/userModels.js'

const userDetails = async (req, res) => {
    const id = req.user.id
    try {
        const user = await User.findById(id)
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not Found' })
        }

        console.log('Fetched User:', user) // Debugging

        res.status(200).json({
            user_id: id,
            user_name: user.fullName,
            phone_number: user.phoneNumber,
            email: user.email,
            profile: user.profiles || [],
        })
    } catch (error) {
        console.error('Error fetching user details:', error.message)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const updateUserDetails = async (req, res) => {
    const id = req.user.id
    const { user_name, phone_number, email, password } = req.body

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' })
        }

        // Update user details
        user.fullName = user_name || user.fullName
        user.phoneNumber = phone_number || user.phoneNumber
        user.email = email || user.email

        const updatedUser = await user.save()

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        })
    } catch (error) {
        console.error('Error updating user details:', error.message)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const changePassword = async (req, res) => {
    const id = req.user.id
    const { old_password, new_password } = req.body

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        // Verify old password
        const isMatch = await bcrypt.compare(old_password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(new_password, salt)

        await user.save()

        res.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
        console.error('Error changing password:', error.message)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export { userDetails, updateUserDetails, changePassword }
