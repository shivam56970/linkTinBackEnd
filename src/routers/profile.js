const express = require('express');
const profileAuth = express.Router();
const {userAuth} = require('../middlewares/adminAuth')
const validation = require('validator');
const validationForTheEdit = require('../utils/validationForEdit');
const bcrypt = require('bcrypt');

profileAuth.get("/profile/view", userAuth, async (req, res) => {    
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileAuth.patch("/profile/edit", userAuth, async (req, res) => {    
  try {
    if(!validationForTheEdit(req))
    {
      throw new Error("The inpus are not valid");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save(); 
    res.send("Profile is Updated");
  } catch (err) {
    res.status(400).send("ERROR edit 2: " + err.message);
  }
});


profileAuth.patch("/profile/passwordChange", userAuth, async (req, res) => {    
  try {
    const {password} = req.body;
    if(!validation.isStrongPassword(password))
    {
      throw new Error("The new password is not strong");
    };
    const loggedInUser  = req.user;
    const passhash = await bcrypt.hash(password, 10);
    loggedInUser.password = passhash;
    await loggedInUser.save(); 
    res.send("Password is Updated");
  } catch (err) {
    res.status(400).send("ERROR edit 2: " + err.message);
  }
});



module.exports = profileAuth;