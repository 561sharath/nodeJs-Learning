
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')


const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies

        const decodeObj = await jwt.verify(token, "Sharath@12345")

        const { _id } = decodeObj

        const user = await UserModel.findById(_id)

        if (!user) {
            throw new Error("User not found")
        }
        req.user = user

        next()
    } catch (err) {
        console.error(err)
        res.status(400).send("Error fetching profile " + err.message)
    }


}
module.exports = { userAuth }