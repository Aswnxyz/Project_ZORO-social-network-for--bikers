const { MessageModel } = require("../models");

class MessageRepository {
async createMessage(sender,receiver,content){
    const message = new MessageModel({
        sender,
        receiver,
        content
    })
   return  await message.save()
}

async getMessages({senderId,receiverId}){
    const messages = await MessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    return messages
}


async getRecentChatts(userId){
  return await MessageModel.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .sort({ timestamp: -1 })
      .exec();
}
}

module.exports= MessageRepository