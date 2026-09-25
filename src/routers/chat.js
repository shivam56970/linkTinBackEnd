const express = require("express");
const { userAuth } = require("../middlewares/adminAuth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetId", userAuth, async (req, res) => {
  const { targetId } = req.params;
  const userId = req.user._id;

  try {
    //console.log("Chat request received for userId: " + userId + " and targetId: " + targetId);
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] },
    }).populate({
        path: "messages.senderId",
        select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetId],
        messages: [],
      });

      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = chatRouter;
