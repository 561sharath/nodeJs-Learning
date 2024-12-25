
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const UserModel = require("../models/user");
const requestRouter = express.Router();


requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

  try {

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"]

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Inavalid status" + status

      })
    }

    const toUser = await UserModel.findOne({
      _id: toUserId
    })

    if (!toUser) {
      return res.status(400).json({
        message: "User not found"
      })
    }



    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingRequest) {
      return res.status(400).json({
        message: "connection request already exists"
      })
    }



    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();

    res.json({
      message: "connection request sent successfully",
      data
    })
  } catch (err) {
    res.status(400).send("ERROR" + err)
  }

  // res.send(user.firstName + " Connection request sent successfully")
})

module.exports = requestRouter;