const socket = require("socket.io");
const cors = require("cors");
const { Chat } = require("../models/chat");
const createServer = (server) => {
  // const io = socket(server, {  this is for local
  //   cors: {
  //     origin: "http://localhost:5173",
  //     methods: ["GET", "POST"],
  //   },
  // });
//this is for production
  const io = socket(server, {
    path: "/api/socket.io",

    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetId, firstName }) => {
      // console.log(' From backend The user id is:'+ userId + "and the userid is" + targetId);
      const roomId = [userId, targetId].sort().join("_");
      //console.log(firstName + " has joined the room: ", roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ userId, targetId, firstName, lastName, text }) => {
     try {
         const roomId = [userId, targetId].sort().join("_");
         //console.log("Message received from " + firstName + ": " + text);

         let chat = await Chat.findOne({
            participants: {$all: [userId,targetId] },
         });

         if(!chat) {
            chat = new Chat({
                participants: [userId,targetId],
                messages:[],
            });
         }
         chat.messages.push({
            senderId: userId,
            text,
         });

         await chat.save();
         io.to(roomId).emit("messageRecieved", { firstName, lastName, text });
     } catch (error) {
        //console.log("The error was this inside the database",error)
     }
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = createServer;
