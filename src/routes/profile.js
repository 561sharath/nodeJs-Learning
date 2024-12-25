
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {

    try {
  
      const user = req.user
  
      if (!user) {
        throw new Error("User not found")
      }
  
  
      res.send(user)
  
    } catch (err) {
      console.error(err)
      res.status(400).json({ message: "Error fetching profile", error: err.message })
    }
  
  
  
  })

  profileRouter.patch('/profile/edit', userAuth, async (req,res) => {

    try{
        if (!validateProfileEditData(req)){
            throw new Error("Invalid edit fields")
        }

        const loggedInUser = req.user

        Object.keys(req.body).forEach((field) => {
            loggedInUser[field] = req.body[field]
        })

        console.log(loggedInUser)

        await loggedInUser.save()

        res.json({message: "Profile edited successfully", user: loggedInUser})
        
    }catch(err){
        console.error(err)
        res.status(400).json({ message: "Error editing profile", error: err.message })
    }
   
  })

  module.exports = profileRouter;