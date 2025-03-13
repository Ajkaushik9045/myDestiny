import mongoose from 'mongoose'
import validator from 'validator'
const { Schema } = mongoose

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            maxLength: 50,
        },
        phoneNumber: {
            type: Number,
            required: true,
            maxLength: 13,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid Email')
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error('Please enter Strong Password')
                }
            },
        },
        photoUrl: {
            type: String,
            // validate: {
            //     validator: function (value) {
            //         return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i.test(
            //             value
            //         )
            //     },
            //     message: 'Invalid profile picture URL',
            // },
        },

        leetCodeCount: {
            type: Number,
            required: true,
            min: 0,
        },

        streak: {
            type: Number,
            required: true,
            min: 0,
        },
        totalLectureCount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
