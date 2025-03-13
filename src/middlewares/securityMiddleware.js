import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import jwt from 'jsonwebtoken'
import csurf from 'csurf'
import { validationResult } from 'express-validator'

const csurfProtection = csurf({ cookie: true })

const setcsurfToken = (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csurfToken())
    next()
}

const securityHeaders = helmet()
const xssProtection = xss()
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
        'Too many requests from this IP, please try again after 15 minutes',
})
const preventHttpParameterPollution = hpp()

const validateRequest = (validations) => {
    return async (req, res, next) => {
        try {
            console.log(
                'Request body before validation:',
                JSON.stringify(req.body, null, 2)
            )

            await Promise.all(
                validations.map((validation) => validation.run(req))
            )
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                return next()
            }
            res.status(400).json({ errors: errors.array() })
        } catch (error) {
            console.error('Error in validation middleware:', error)
            res.status(500).json({ error: 'Server error during validation' })
        }
    }
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Missing token.' })
    }
    if (process.env.SESSION_SECRET) {
        jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
            if (err) {
                return res
                    .status(403)
                    .json({ message: 'Unauthorized. Invalid token.' })
            }
            req.user = user
            next()
        })
    }
}

export {
    securityHeaders,
    xssProtection,
    rateLimiter,
    preventHttpParameterPollution,
    validateRequest,
    verifyToken,
    csurfProtection,
    setcsurfToken,
}
