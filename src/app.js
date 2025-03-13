import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/onboardingRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import {
    securityHeaders,
    xssProtection,
    preventHttpParameterPollution,
} from '../src/middlewares/securityMiddleware.js'
import { cloudinaryConnect } from '../src/config/cloudinary.js'

const app = express()

// Connect to Cloudinary
cloudinaryConnect()

// Middleware configurations
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:8081',
    ],
    credentials: true,
}

app.set('trust proxy', 1)

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    keyGenerator: (req) => req.ip || 'default-key', // Ensure a fallback string
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests, please try again later.',
        })
    },
})

// Middleware Usage
// app.use(limiter); // Uncomment to use rate limiter
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(securityHeaders)
app.use(xssProtection)
// app.use(rateLimiter); // Uncomment to use rate limiter
app.use(preventHttpParameterPollution)
app.use(cookieParser())

// Logging with Morgan
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
        ].join(' ')
    })
)

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/transaction', transactionRoutes)

// Default route
app.get('/', (req, res) => {
    res.send('🚀 SERVER IS RUNNING 🚀')
})

export default app
