const { MessageRepository } = require("../database");
const { RPCRequest } = require("../utils");

class MessageService {
  constructor(io) {
    this.io = io;
    this.repository = new MessageRepository();
  }
  async createMessage({ sender, receiver, content }) {
    return await this.repository.createMessage(sender, receiver, content);
  }

  async getMessages(data) {
    const result = await this.repository.getMessages(data);
    return result;
  }

  async getRecentChattedUsers(userId) {
    const messages = await this.repository.getRecentChatts(userId);
    const uniqueUserIds = Array.from(
      new Set(
        messages.flatMap((message) =>
          [message.sender, message.receiver].map(String)
        )
      )
    );

    const recentChattedUserIds = uniqueUserIds.filter(
      (id) => id.toString() !== userId
    );
   
    const recentChattedUsersData = await Promise.all(
      recentChattedUserIds.map(async (id) => {
        const userData = await RPCRequest("USERS_RPC", {
          type: "GET_USERS_WITH_ID",
          data: [id],
        });

        // Find the last message for the user
        const lastMessage = messages
          .filter((message) => [message.sender.toString(), message.receiver.toString()].includes(id))
          .sort((a, b) => b.timestamp - a.timestamp)[0];



        // Include the last message in user data
        return {
          ...userData,
          lastMessage,
        };
      })
    );

    return recentChattedUsersData;
  }

  async readMessage(data){
    return await this.repository.readMessage(data)

  }

  async getUnreadMessages(userId){
    return await this.repository.unreadedMessages(userId)
  }

  // RPC Response
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "GET_MESSAGES":
        return await this.getMessages(data);
        break;
      default:
        break;
    }
  }
}

module.exports = MessageService;
