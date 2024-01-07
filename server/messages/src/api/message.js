const MessageService = require("../services/message-service");
const { RPCObserver } = require("../utils");
// const { SubscribeMessage } = require("../utils");
const userAuth = require("./middlewares/auth");
module.exports = (app, channel, io) => {
  const service = new MessageService(io);
  RPCObserver("MESSAGES_RPC",channel, service);


io.on("connection", (socket) => {



    socket.on("registerUser", async (userId) => {
      socket.join(userId);
      console.log(`${userId} connected`);

      // Emit unread notifications to the user upon connection
      try {
        io.to(userId).emit("connected");
      } catch (error) {
        console.error(`Error getting unread notifications: ${error.message}`);
      }
    });

  socket.on("message", async (data) => {
    console.log('message comes')
    try {
       const newMessage= await service.createMessage(data);
      io.to(data.receiver).emit("message",{text:newMessage,sender:data.sender});
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  // });
});



app.get("/getRecentChattedUsers",userAuth,async(req,res,next)=>{
try {
  const data = await service.getRecentChattedUsers(req.user._id);
  return res.status(200).json(data)
} catch (error) {
  next(error)
}
});


};
