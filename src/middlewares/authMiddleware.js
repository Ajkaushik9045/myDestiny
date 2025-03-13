import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    // Ensure the token is provided in the "Authorization" header as a Bearer token
    const token = req.header('Authorization')?.split(' ')[1]
    const secret = process.env.SESSION_SECRET;

    // If no token is provided, deny authorization
    if (!token) {
        return res
            .status(401)
            .json({ message: 'No token, authorization denied' })
    }

    if (secret) {
        try {
            // Verify the token with the secret
            const decoded = jwt.verify(token, secret)
            req.user = decoded // Attach the decoded user to the request object

            console.log('Decoded User - ', req.user)

            // Optionally, you can check if the user exists in the database
            // const user = await User.findById(req.user.id);
            // if (!user || user.tokenExpiresAt < new Date()) {
            //     return res.status(401).json({ message: 'Token expired, please log in again' });
            // }

            next() // Proceed to the next middleware or route handler
        } catch (err) {
            // Log error for debugging
            console.error('Token verification error:', err)
            return res.status(401).json({ message: 'Token is not valid' })
        }
    } else {
        res.status(500).json({
            message: 'Server configuration error: No JWT_SECRET',
        })
    }
}

export default authMiddleware
