const express = require("express");
const userAuthh = express.Router();
const { userAuth } = require("../middlewares/adminAuth");
const ConnectionRequest = require("../models/connectionRequestSchema");
const details = ("firstName lastName photoUrl emailId age gender talent");
const User = require("../models/user");

userAuthh.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUSer = req.user;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUSer._id,
      status: "intrested",
    }).populate("fromUserId", details);
    return res.status(200).json({
      message: "The Data has been fetched sucessfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userAuthh.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUSer = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUSer._id, status: "accepted" },
        { toUserId: loggedInUSer._id, status: "accepted" },
      ],
    }).populate("fromUserId",details).populate("toUserId",details);

    const data = connectionRequest.map((row) =>
        {
           if(row.fromUserId._id.toString() === loggedInUSer._id.toString())
           {
            return row.toUserId;
           }
           return row.fromUserId;
        });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send("ERROR: "+err.message);
  }
});

userAuthh.get('/user/feed',userAuth,async(req,res) => {

    const loggedInUSer = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 100 ? 100 : limit;
    const skip = (page-1)*limit;

    const connectionRequest = await ConnectionRequest.find({
        $or: [
            {fromUserId:loggedInUSer._id},
            {toUserId:loggedInUSer._id}
        ]
    }).select("fromUserId toUserId");

    const hiddenProfileFromSet = new Set();

    connectionRequest.map((data) => {
        hiddenProfileFromSet.add(data.fromUserId.toString());
        hiddenProfileFromSet.add(data.toUserId.toString());
    });

    const users = await User.find({
        $and:[
            {_id: {$nin: Array.from(hiddenProfileFromSet)}},
            {_id:{$ne: loggedInUSer._id}}
        ]
    }).select(details).skip(skip).limit(limit);

    res.status(200).json({
        message:"The data is as below",
        data:users,
    });
})

module.exports = userAuthh;
