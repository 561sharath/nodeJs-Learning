const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName about skills photoUrl");

    res.json({
      message: "Connection Requests",
      data: connectionRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error" + err.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    }).populate("fromUserId", "firstName lastName about skills photoUrl");

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connections",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error " + err);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new set();

    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId);
      hideUsersFromFeed.add(request.toUserId);
    });

    hideUsersFromFeed.add(loggedInUser._id);

    const users = await UserModel.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUsersFromFeed),
          },
        },
        {
          _id: {
            $ne: loggedInUser._id,
          },
        },
      ],
    })
      .select("firstName lastName about skills photoUrl")
      .skip((page - 1) * limit)
      .limit(limit);

    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(400).send("Internal Server Error " + err);
  }
});

module.exports = userRouter;
