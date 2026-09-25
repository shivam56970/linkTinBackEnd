const express = require('express');
const requestAuth = express.Router();
const {userAuth} = require('../middlewares/adminAuth')
const ConnectionRequest = require('../models/connectionRequestSchema');
const User = require('../models/user');
const sendEmail = require("../utils/sendEmail");

requestAuth.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {    
  try {
   const fromUserId = req.user._id;
   const toUserId  = req.params.toUserId;
   const status = req.params.status;
   const allowedStatus = ["ignored","intrested"];
   if(!allowedStatus.includes(status))
   {
    return res.status(400).json({
      message:"Invalid Status: " + status
    });
   }

   const toUser = await User.findById(toUserId);
   if(!toUser)
   {
    return res.status(400).json({message:"User NOt found"});
   }

   const existingConnectionReques = await ConnectionRequest.findOne({
    $or :[
      { fromUserId, toUserId },
      { fromUserId:toUserId, toUserId:fromUserId },
    ],
   });

   if(existingConnectionReques)
   {
    return res.status(400).send({message:'Connection Already exist!'});
   }


   const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status,
   });

   const data = await connectionRequest.save();

   const senResp = await sendEmail.run("A new friend request from " + req.user.firstName,
    req.user.firstName + " is " + status + " in " + toUser.firstName
   );

   //console.log("we got the email resp",senResp);

   res.json({
    message: "Connection Request has been sent Sucessfully",
    data
   });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


requestAuth.post("/request/review/:status/:requestId", userAuth, async (req, res) => {  

  try{
      const loggesInUSer = req.user;
      //console.log("Logged in user is",loggesInUSer);
  // first verfy the status if valid or not
  const {status,requestId} = req.params;
   //console.log("From backend: The id we got from the api caling is"+requestId+"and the status is"+status);
  const allowedStatus = ["accepted","rejected"];

  if(!allowedStatus.includes(status))
  {
    return res.status(400).json({
      message:"The status is invalid",status
    });
  }

  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggesInUSer._id,
    status:"intrested"
  });

  if(!connectionRequest)
  {
    return res.status(404).json({
      message: "The connection cannot be made"
    });
  }
  connectionRequest.status = status;
  const data  = await connectionRequest.save();

  res.status(200).json({
    message: "Connection request hass been accepted",
    data: data
  });

  }
  catch(err)
  {
    res.status(400).send("Error from request"+err.message);
  }

});
module.exports = requestAuth;