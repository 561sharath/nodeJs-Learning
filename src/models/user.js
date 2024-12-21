const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true
        // required : true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid " + value)
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong")
            }
        }
    },
    age: {
        type: Number,
        trim: true,
        min: 18
    },
    gender: {
        type: String,
        // trim: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is invalid " + value)
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using Node Learning"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;