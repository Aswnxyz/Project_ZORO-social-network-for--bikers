const { MessageModel, ChatModel } = require("../models");

class MessageRepository {


  async findChat(userId, currentUserId) {
    return await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("latestMessage")
      .lean();
  }
  async createChat(chatData) {
    return await ChatModel.create(chatData);
  }

  async findChats(userId) {
    return await ChatModel.find({
      users: { $elemMatch: { $eq: userId } },
      latestMessage: { $exists: true },
    })
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .lean();
  }
  async createGroup(groupData) {
    return await ChatModel.create(groupData);
  }
  async renameGroup(chatId, chatName) {
    return await ChatModel.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    ).lean();
  }
  async addUsersToGroup(chatId, selectedUsers) {
    return await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { users: { $each: selectedUsers } },
      },
      { new: true }
    ).lean()
  }

  async removeUserFromGroup(chatId,userId){
    return await ChatModel.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true}).lean()
  }
  async leaveGroup(chatId,userId){
    return await ChatModel.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true})
  }
  async createMessage(newMessage){
    return await MessageModel.create(newMessage)
  }
  async setLastmessage(chatId,message){
    return  await ChatModel.findByIdAndUpdate(chatId,{latestMessage:message._id})
  }

  async getMessages(chatId){
return await MessageModel.find({chat:chatId}).populate("chat")
  }
}

module.exports = MessageRepository;
