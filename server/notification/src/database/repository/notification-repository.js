const { NotificationModel } = require("../models");

class NotificationRepository {
  async createNofification({
    sender,
    recipient,
    type,
    content,
    contentDetails,
  }) {
    const notification = new NotificationModel({
      sender,
      recipient,
      type,
      content,
      contentDetails,
    });

    return await notification.save();
  }

  async getNotificationByPostIdAndSenderId(postId, senderId) {
    const query = {};

    if (postId) {
      query["contentDetails.postId"] = postId;
    }

    query["sender"] = senderId;

    return await NotificationModel.findOne(query);
  }
  async deleteNotificationById(_id) {
    await NotificationModel.findOneAndDelete({ _id });
  }
  async getNotificationsByUserId(userId) {
    return await NotificationModel.find({ recipient: userId });
  }
  async removeNotification({ sender, postId, type, commentId ,recipient}) {
  const query = {};

  if (postId && type === "like") {
    // For 'like' type, delete by sender and post ID
    query["contentDetails.postId"] = postId;
  } else if (commentId && type === "comment") {
    // For 'comment' type, delete by sender and comment ID
    query["contentDetails.commentId"] = commentId;
  }

  query["sender"] = sender;

  if (type === "follow") {
    // For 'follow' type, include recipient in the query
    query["recipient"] = recipient;
  }
    return await NotificationModel.findOneAndDelete(query);
    // return await NotificationModel.findOneAndDelete({ sender ,"contentDetails.postId":postId});
  }


  async getUnreadNotifications(userId){
    return await NotificationModel.find({recipient:userId,isRead:false}).countDocuments()
  }
  async clearUnreadNotifications(userId){
    await NotificationModel.updateMany({recipient:userId},{$set:{isRead:true}})
  }
}

module.exports = NotificationRepository;
