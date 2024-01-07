// const { PostRepository } = require("../database");

const {NotificationRepository} = require("../database");
const { RPCRequest } = require("../utils");

// const cloudinary = require("../utils/cloudinary");

class NotificationService {
  constructor(io) {
    this.io = io;
    this.repository = new NotificationRepository();
  }

  async getUnreadNotifications(userId){
    return await this.repository.getUnreadNotifications(userId)
  }

  async getNotifications(userId) {
    const notifications = await this.repository.getNotificationsByUserId(
      userId
    );
    const userIds = [
      ...new Set(notifications.map((notification) => notification.sender)),
    ];
    const postIds = [
      ...new Set(
        notifications
          .filter(
            (notification) =>
              notification.type === "like" || notification.type === "comment"
          )
          .map((notification) => notification.contentDetails.postId)
      ),
    ];
   

    const users = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: userIds,
    });
    const posts = await RPCRequest("POSTS_RPC", {
      type: "GET_POST_WITH_ID",
      data: postIds,
    });

 

    // Map user and post details to dictionaries for quick lookup
    const usersMap = {};
    users.forEach((user) => {
      usersMap[user._id.toString()] = user;
    });

    const postsMap = {};
    posts.forEach((post) => {
      postsMap[post._id.toString()] = post;
    });

     

    // Combine user, post, and notification details
    const notificationsWithDetails = notifications.map((notification) => ({
      ...notification.toObject(),
      senderDetails: usersMap[notification.sender.toString()],
      // Add postDetails only for specific notification types
      postDetails:
        notification.type === "like" || notification.type === "comment"
          ? postsMap[notification.contentDetails.postId.toString()]
          : null,

     
    }));
    const sortedNotifications = notificationsWithDetails.sort(
      (a, b) => b.timestamp - a.timestamp
    );

    return sortedNotifications;
  }

  async createNotification(data) {
    
  
    const newNotification = await this.repository.createNofification(data);
    this.io
      .to(data.recipient)
      .emit("notification", { message: "You have a new notification!" });
    return newNotification;
  }


  async clearUnreadNotifications(userId){
    await this.repository.clearUnreadNotifications(userId)
  }




  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "NEW_NOTIFICATION":
        await this.createNotification(data);
        break;
        case "REMOVE_NOTFICATION":
          await this.repository.removeNotification(data)
      default:
        break;
    }
  }
}

module.exports = NotificationService;
