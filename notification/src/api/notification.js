const NotificationService = require("../services/notification-service");
const { SubscribeMessage } = require("../utils");
const userAuth = require("./middlewares/auth")
const express = require("express");
module.exports = (app,channel,io) => {
  const service = new NotificationService(io);
    SubscribeMessage(channel, service);
    const router = express.Router();

  io.of("/notification").on("connection", (socket) => {
    console.log("User connected to socket");

    socket.on("registerUser", async (userId) => {
      socket.join(userId);
      console.log(`${userId} connected`);

      // Emit unread notifications to the user upon connection
      try {
        const unreadNotifications = await service.getUnreadNotifications(
          userId
        );
        io.to(userId).emit("unreadNotifications", unreadNotifications);

        

        io.to(userId).emit("connected");
      } catch (error) {
        console.error(`Error getting unread notifications: ${error.message}`);
      }
    });

    // Other event handlers...
    socket.on("clearUnreadNotifications",async (userId) => {
      // Clear unread notifications for the user
      try {
          await service.clearUnreadNotifications(userId);
      const unreadNotifications = await service.getUnreadNotifications(
          userId
        );
        io.to(userId).emit("unreadNotifications", unreadNotifications);
      } catch (error) {
        
      }
    
    });

    // Disconnect event (optional)
    // socket.on("disconnect", () => {
    //   console.log("User disconnected");
    // });
  });

    router.get('/getNotifications',userAuth,async(req,res,next)=>{
        try {
          const data = await service.getNotifications(req.user._id);
          return res.status(200).json(data)
        } catch (error) {
          next(error)
        }

    })
    

    app.use("/api/notification", router);

}