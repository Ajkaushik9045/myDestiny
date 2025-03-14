import User from '../models/userModels.js'

const streakUpdate = async (req, res) => {
    const { userId } = req.user

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not Found' })
        }

        if (user.streakUpdateDate !== '') {
            let lastUpdateDate = user.streakUpdateDate
                ? new Date(user.streakUpdateDate).toISOString().split('T')[0]
                : null
            let todayDate = new Date().toISOString().split('T')[0]

            if (lastUpdateDate === todayDate) {
                return res
                    .status(205)
                    .json({ message: 'You Already Added a Streak.', user })
            }
        }

        user.streakUpdateDate = new Date()
        user.streak = user.streak + 1
        await user.save()

        res.status(200).json({ user, message: 'Streak Added' })
    } catch (error) {
        console.error('Error fetching user details:', error.message)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        if (users.length === 0) {
            return res.status(404).json({ message: 'Users not Found' })
        }

        await Promise.all(
            users.map(async (user) => {
                if (!user.leetCodeUserName) return // Skip if username is missing

                try {
                    const response = await axios.get(
                        `https://leetcode-api.vercel.app/api/profile/${user.leetCodeUserName}`
                    )
                    const submission =
                        response.data?.data?.matchedUser?.submitStats
                            ?.acSubmissionNum[0]?.count
                    user.leetCodeCount = submission
                    await user.save()
                } catch (error) {
                    console.error(
                        `Error fetching LeetCode data for ${user.leetCodeUserName}`,
                        error.message
                    )
                }
            })
        )

        res.status(200).json({
            users,
            message: 'Users data fetched successfully',
        })
    } catch (error) {
        console.error('Error fetching user details:', error.message)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const leactureUpdate = async (req, res) => {
    const { userId } = req.user
    const { totalLectureCount } = req.body
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not Found' })
        }

        if (!totalLectureCount) {
            return res
                .status(404)
                .json({ message: 'Total Lecture Count not Found' })
        }

        user.totalLectureCount = totalLectureCount
        await user.save()

        res.status(200).json({ user, message: 'Lecture Count Updated' })
    } catch (error) {
        console.error('Error fetching user details:', error.message)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export { streakUpdate, getAllUsers, leactureUpdate }
