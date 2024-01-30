const { MessageRepository } = require("../database");
const { RPCRequest } = require("../utils");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const {
  ACCESS_KEY,
  SECRET_ACCESS_KEY,
  BUCKET_REGION,
  BUCKET_NAME,
} = require("../config");
const { userInfo } = require("os");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

class MessageService {
  constructor(io) {
    this.io = io;
    this.repository = new MessageRepository();
  }

  async accessChat(req) {
    const { userId } = req.body;

    const isChat = await this.repository.findChat(userId, req.user._id);

    const userDetails = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: [userId, req.user._id],
    });

    if (isChat.length > 0) {
      isChat[0].users = userDetails;
      return isChat[0];
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const newChat = await this.repository.createChat(chatData);
      const updatedChat = newChat.toObject();
      updatedChat.users = userDetails;
      return updatedChat;
    }
  }

  async fetchData(userId) {
    const recentChats = await this.repository.findChats(userId);
    console.log(recentChats)
    const userIDsExceptCurrentUser = recentChats
      .map((chat) => chat.users.map((user) => user.toString()))
      .flat();

    const uniqueUserIDs = [...new Set(userIDsExceptCurrentUser)];

    const userDetails = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: uniqueUserIDs,
    });

    const userMapping = userDetails.reduce((acc, user) => {
      acc[user._id.toString()] = user; // Assuming _id is the user ID field
      return acc;
    }, {});

    // Now you can use the userMapping to associate user details with their user IDs
    const recentChatsWithUserDetails = recentChats.map((chat) => {
      const usersWithDetails = chat.users.map(
        (userId) => userMapping[userId.toString()]
      );
      return { ...chat, users: usersWithDetails };
    });

    return recentChatsWithUserDetails;
  }

  async createGroupChat(req) {
    const users = req.body.users;
    users.push(req.user._id);
    const groupData = {
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    };

    const newGroup = await this.repository.createGroup(groupData);
    const modifiedGroup = newGroup.toObject();

    const userDetails = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: users,
    });

    modifiedGroup.users = userDetails;
    modifiedGroup.groupAdmin = userDetails.find(
      (user) => user._id.toString() === req.user._id.toString()
    );

    return modifiedGroup;
  }

  async renameGroup({ chatId, chatName }) {
    const modifiedData = await this.repository.renameGroup(chatId, chatName);
    const userDetails = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: modifiedData.users,
    });
    modifiedData.users = userDetails;
    return modifiedData;
  }

  async addUserToGroup({ chatId, selectedUsers }) {
    const updatedChat = await this.repository.addUsersToGroup(
      chatId,
      selectedUsers
    );
    const userDetails = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: updatedChat.users,
    });
    updatedChat.users = userDetails;
    return updatedChat;
  }

  async removeUserFromGroup({ chatId, userId }) {
    const updatedChat = await this.repository.removeUserFromGroup(
      chatId,
      userId
    );
    const userDetails = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: updatedChat.users,
    });
    updatedChat.users = userDetails;
    return updatedChat;
  }

  async leaveGroup(req) {
    const { chatId } = req.body;
    return await this.repository.leaveGroup(chatId, req.user._id);
  }

  async sendMessage(req) {
    const { content, chatId } = req.body;
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    let message = await this.repository.createMessage(newMessage);
    message = await message.populate("chat");
    
    // const userDetails = await RPCRequest("USERS_RPC", {
    //   type: "GET_USER",
    //   data: message.sender,
    // });
    const updatedMessage = message.toObject();

    // updatedMessage.sender = userDetails;

    await this.repository.setLastmessage(chatId, message);

    return updatedMessage;
  }
  async getMessages(req){
    console.log(req.query)
    const messages = await this.repository.getMessages(req.query.chatId);
    return messages
  }

  // async createMessage({ sender, receiver, content }) {
  //   return await this.repository.createMessage(sender, receiver, content);
  // }

  // async getMessages(data) {
  //   const result = await this.repository.getMessages(data);
  //   return result;
  // }

  // async getRecentChattedUsers(userId) {
  //   const messages = await this.repository.getRecentChatts(userId);
  //   const uniqueUserIds = Array.from(
  //     new Set(
  //       messages.flatMap((message) =>
  //         [message.sender, message.receiver].map(String)
  //       )
  //     )
  //   );

  //   const recentChattedUserIds = uniqueUserIds.filter(
  //     (id) => id.toString() !== userId
  //   );

  //   const recentChattedUsersData = await Promise.all(
  //     recentChattedUserIds.map(async (id) => {
  //       const userData = await RPCRequest("USERS_RPC", {
  //         type: "GET_USERS_WITH_ID",
  //         data: [id],
  //       });

  //       // Find the last message for the user
  //       const lastMessage = messages
  //         .filter((message) =>
  //           [message.sender.toString(), message.receiver.toString()].includes(
  //             id
  //           )
  //         )
  //         .sort((a, b) => b.timestamp - a.timestamp)[0];

  //       // Include the last message in user data
  //       return {
  //         ...userData,
  //         lastMessage,
  //       };
  //     })
  //   );

  //   return recentChattedUsersData;
  // }

  // async readMessage(data) {
  //   return await this.repository.readMessage(data);
  // }

  // async getUnreadMessages(userId) {
  //   return await this.repository.unreadedMessages(userId);
  // }

  // async createGroup(req) {
  //   const imageName = randomImageName();
  //   const params = {
  //     Bucket: BUCKET_NAME,
  //     Key: `groupIcons/${imageName}`,
  //     Body: req.file.buffer,
  //     ContentType: req.file.mimetype,
  //   };
  //   const command = new PutObjectCommand(params);
  //   await s3.send(command);

  //   const newGroupDocument = await this.repository.createGroup(
  //     req.user._id,
  //     req.body,
  //     imageName
  //   );
  //   const newGroup = newGroupDocument.toObject();
  //   const getObjectParams = {
  //     Bucket: BUCKET_NAME,
  //     Key: `groupIcons/${newGroup.photo}`,
  //   };

  //   const Command = new GetObjectCommand(getObjectParams);
  //   const url = await getSignedUrl(s3, Command, { expiresIn: 300 });
  //   console.log(url);
  //   newGroup.imageUrl = url;
  //   return newGroup;
  // }

  // // RPC Response
  // async serveRPCRequest(payload) {
  //   const { type, data } = payload;
  //   switch (type) {
  //     case "GET_MESSAGES":
  //       return await this.getMessages(data);
  //       break;
  //     default:
  //       break;
  //   }
  // }
}

module.exports = MessageService;
