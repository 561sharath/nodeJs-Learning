const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

userSchema.methods.getJWT = async function () {

    const user = this

    const token = await jwt.sign({_id: user._id}, "Sharath@12345", {expiresIn: "1d"})

    return token
}

userSchema.methods.validatePassword = async function(paswordInputByUser) {
    
    const user = this

    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(paswordInputByUser, passwordHash)

    return isPasswordValid
}

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;