const MessageService = require("../services/message-service");
const { RPCObserver } = require("../utils");
// const { SubscribeMessage } = require("../utils");
const userAuth = require("./middlewares/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const express = require("express");
module.exports = (app, channel,io) => {
  const service = new MessageService();
  RPCObserver("MESSAGES_RPC", channel, service);
  const router = express.Router();

  io.on("connection",(socket)=>{
    console.log('connected to socket io');

    socket.on("setup",(userId)=>{
      socket.join(userId)
      console.log(userId)
      socket.emit('connected')
    })

    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("User joined room."+room)
    })

    socket.on('typing',(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=> socket.in(room).emit('stop typing'))

    socket.on("new message",(newMessageRecieved)=>{
      const chat = newMessageRecieved.chat;
      if(!chat.users) return console.log('chat users not defined')

      chat.users.forEach((user)=>{
        if(user == newMessageRecieved.sender) return 
        socket.in(user).emit("message recieved",newMessageRecieved)
      })
    })
    socket.on("video_call", (chatId) => {
      if (!chatId) return;
      socket.in(chatId).emit("recieveVideoCall", chatId);
    });
 socket.off("setup", () => {
   console.log("user disconnected");
   socket.leave(userId);
 });

  })




  router.post("/", userAuth, async (req, res, next) => {
    try {
      const data = await service.accessChat(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.get("/", userAuth, async (req, res, next) => {
    try {
      const data = await service.fetchData(req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.post("/group", userAuth, async (req, res, next) => {
    try {
      const data = await service.createGroupChat(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.put("/rename", userAuth, async (req, res, next) => {
    try {
      const data = await service.renameGroup(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.put("/addUserToGroup", userAuth, async (req, res, next) => {
    try {
      const data = await service.addUserToGroup(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.put("/removeUserFromGroup", userAuth, async (req, res, next) => {
    try {
      const data = await service.removeUserFromGroup(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.put("/leaveGroup",userAuth,async(req,res,next)=>{
    try {
      const data = await service.leaveGroup(req);
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  })
  router.post("/message", userAuth, async (req, res, next) => {
    try {
      const data = await service.sendMessage(req);
      return res.status(200).json(data)
    } catch (error) {next(error)}
  });
  router.get("/message",userAuth,async(req,res,next)=>{
    try {
      const data = await service.getMessages(req);
      return res.status(200).json(data)

    } catch (error) {
      next(error)
    }
  })

  app.use("/api/message", router);
};
