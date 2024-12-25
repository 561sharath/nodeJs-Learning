
const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken")

authRouter.post("/signup", async (req, res) => {
    // const userData = req.body;
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)


        // Create a new user instance
        const user = new UserModel({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        }

        );


        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error saving user data", error: err.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
  
      const { emailId, password } = req.body
  
      const user = await UserModel.findOne({ emailId: emailId })
  
      if (!user) {
        throw new Error("User not found")
      }
      const isPasswordValid = await user.validatePassword(password)
      if (isPasswordValid) {
  
        const token = await user.getJWT();
    
        res.cookie("token", token, {
          expires: new Date(Date.now() + 86400000),
        })
  
        res.send("Login successful")
      } else {
        throw new Error("user not found")
      }
  
    } catch (err) {
      console.error(err)
      res.status(400).json({ message: "Error logging in", error: err.message })
    }
  })

authRouter.post("/logout", async (req,res) => {

    res.cookie("token", null, {
        expires: new Date(Date.now())
    })

    res.send("Logged out successfully")
})

module.exports = authRouter;