const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema({

    userName: {
        type: String,
        required: true,
        maxLength: 50
    },
    phoneNumber: {
        type: Number,
        required: true,
        maxLength: 13,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter Strong Password");
            }
        }
    },
    photoUr:{
        type:String,
        validate:{

        }
    },
    leetCodeCount:{
        type:Number,

    }


});
