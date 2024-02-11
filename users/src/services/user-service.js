const {
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
  GenerateSignature,
  SendVerifyMail,
  RPCRequest,
} = require("../utils");
const { UserRepository } = require("../database");
const {
  NotFoundError,
  ValidationError,
  AuthorizeError,
} = require("../utils/errors/app-errors");
const cloudinary = require("../utils/cloudinary");
const { NOTIFICATION_SERVICE } = require("../config");

//All business logic will be here
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async signUp(userInputs, res) {
    const { userName, fullName, email, password } = userInputs;

    let existingUser = await this.repository.findUser({ email });
    if (existingUser?.isVerified)
      throw new AuthorizeError("User already exist!");

    const InvalidUserName = await this.repository.findUserByUsername(userName);
    if (InvalidUserName) throw new ValidationError("UserName already exist!");

    if (!existingUser) {
      //create salt
      const salt = await GenerateSalt();

      const userPassword = await GeneratePassword(password, salt);

      existingUser = await this.repository.createUser({
        userName,
        fullName,
        email,
        password: userPassword,
        salt,
      });
    }

    SendVerifyMail(fullName, email, existingUser._id);
    const token = await GenerateSignature(
      {
        email: email,
        _id: existingUser._id,
      },
      res
    );

    return { id: existingUser._id, token };
  }

  async verifyOtp(userInputs, req) {
    const { email, otp } = userInputs;
    const existingUser = await this.repository.findUser({ email });
    const otpData = await this.repository.findOtp(existingUser._id);
    if (otpData.expiresAt < Date.now())
      throw new AuthorizeError("Code has been expired .Please request again.");

    if (otpData.otp !== otp) throw new NotFoundError("Invalid OTP!");

    await this.repository.verifyUser(existingUser._id);
    await this.repository.clearOtp(existingUser._id);
    const token = req.cookies.jwt;
    // return { id: existingUser._id, token };
    return {
      id: existingUser._id,
      userName: existingUser.userName,
      pic: existingUser.profilePic?.url,
      fullName: existingUser.fullName,
      followers:existingUser.followers,
      following:existingUser.following,
      savedPosts:existingUser.savedPosts
    };
  }

  async signIn(userInputs, res) {
    const { decoded } = userInputs;
    if (decoded) {
    }
    const { email, userName, password } = userInputs;

    const existingUser = await this.repository.findUserWithEmailOrUserName({
      email,
      userName,
    });

    if (!existingUser?.isVerified || !existingUser?.isActive) {
      const notFoundMessage = userName
        ? `User not found with username: ${userName}`
        : `User not found with email: ${email}`;

      throw new NotFoundError(notFoundMessage);
    }

    const validPassword = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );
    if (!validPassword) throw new ValidationError("password does not match!");
    const token = await GenerateSignature(
      {
        email: existingUser.email,
        _id: existingUser._id,
      },
      res
    );

    return {
      id: existingUser._id,
      userName: existingUser.userName,
      pic: existingUser.profilePic?.url,
      fullName: existingUser.fullName,
      followers: existingUser.followers,
      following: existingUser.following,
      savedPosts: existingUser.savedPosts,
      token
    };
  }
  async googleAuth(decoded, res) {
    const { given_name, name, email } = decoded;
    let existingUser = await this.repository.findUser({ email });
    if (!existingUser) {
      let userData = true;
      let randomNum;
      while (userData) {
        randomNum = `${Math.floor(1000 + Math.random() * 9000)}`;
        userData = await this.repository.findUserByUsername(
          given_name + randomNum
        );
      }
      existingUser = await this.repository.createUser({
        userName: given_name + randomNum,
        fullName: name,
        email,
      });
      await this.repository.verifyUser(existingUser._id);
    }
    if (!existingUser.isActive) {
      throw new AuthorizeError();
    }

    const token = await GenerateSignature(
      {
        email: email,
        _id: existingUser._id,
      },
      res
    );
    // return { id: existingUser._id, token };
    return {
      id: existingUser._id,
      userName: existingUser.userName,
      pic: existingUser.profilePic?.url,
      fullName: existingUser.fullName,
      followers: existingUser.followers,
      following: existingUser.following,
      savedPosts: existingUser.savedPosts,
    };
  }

  async getProfile(userName) {
    const userData = await this.repository.findUserByUsername(userName);
    const posts = await RPCRequest("POSTS_RPC", {
      type: "GET_USER_POSTS",
      data: userData._id,
    });

    return { userData, posts };
  }

  async updateProfile(id, userData) {
    const existinguser = await this.repository.findUserById(id);

    if (existinguser) {
      existinguser.fullName = userData.fullName;
      existinguser.bio = userData.bio;
      existinguser.location = userData.location;
      if (userData.profilePic) {
        const result = await cloudinary.uploader.upload(userData.profilePic, {
          folder: "profilePic",
        });
        existinguser.profilePic = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
      if (userData.coverPic) {
        const result = await cloudinary.uploader.upload(userData.coverPic, {
          folder: "coverPic",
        });
        existinguser.coverPic = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
    }
    const udpdatedUser = await existinguser.save();

    return udpdatedUser;
  }

  async followUser({ userName, state }, userId) {
    if (state === "follow") {
      const followedUser = await this.repository.findUserByUsername(userName);
      if (!followedUser.privateAccount) {
        const data = await this.repository.followUser(userName, userId);
        // const followedUser = await this.repository.findUserByUsername(userName);
        const payload = {
          event: "NEW_NOTIFICATION",
          data: {
            type: "follow",
            sender: userId,
            recipient: followedUser._id,
            content: `started following you.`,
          },
        };

        return { data, payload };
      } else {
        const data = await this.repository.followRequestUser(userName, userId);
        const payload = {
          event: "NEW_NOTIFICATION",
          data: {
            type: "followRequest",
            sender: userId,
            recipient: followedUser._id,
            content: `requested to follow you.`,
          },
        };
        return { data, payload };
      }
    } else if (state === "unfollow") {
      const data = await this.repository.unfollowUser(userName, userId);
      const followedUser = await this.repository.findUserByUsername(userName);

      const payload = {
        event: "REMOVE_NOTFICATION",
        data: { sender: userId, recipient: followedUser._id, type: "follow" },
      };
      return { data, payload };
    }
  }

  async getUsers(userIds) {
    return this.repository.getUsersWithId(userIds);
  }

  async savePost({ postId }, userId) {
    const data = await this.repository.updateSavedPost(postId, userId);

    return data;
  }

  async getSavedPosts({ userName }) {
    const user = await this.repository.findUserByUsername(userName);
    if (!user?.savedPosts.length) return [];
    const postIds = user.savedPosts;
    const savedPosts = await RPCRequest("POSTS_RPC", {
      type: "GET_POST_WITH_ID",
      data: postIds,
    });
    if (savedPosts) {
      return savedPosts;
    }
  }

  async createGarage({ nickName, media, year, model }, userId) {
    const result = await cloudinary.uploader.upload(media, {
      folder: "garage",
    });

    return await this.repository.createGarage(
      nickName,
      year,
      model,
      userId,
      result
    );
  }

  async addToRecentSearch({ userId }, _id) {
    return await this.repository.addRecentSearch(userId, _id);
  }

  async getRecentUsers(userId) {
    const allUserIds = await this.repository.getRecentUsers(userId);
    const users = await this.repository.getUsersWithId(allUserIds);
    const sortedUsers = allUserIds.map((userId) =>
      users.find((user) => user._id.equals(userId))
    );
    return sortedUsers;
  }

  async clearRecentSearch(userId) {
    const result = await this.repository.clearRecentSearch(userId);
    return result;
  }

  async getUserDataWithMessages(userId, currentUserId) {
    const user = await this.repository.findUserById(userId);
    const messages = await RPCRequest("MESSAGES_RPC", {
      type: "GET_MESSAGES",
      data: { senderId: currentUserId, receiverId: userId },
    });
    return { user, messages };
  }

  async changePassword({ currentPassword, newPassword }, userId) {
    const user = await this.repository.findUserById(userId);

    const validPassword = await ValidatePassword(
      currentPassword,
      user.password,
      user.salt
    );
    if (!validPassword) throw new ValidationError("password does not match!");

    const salt = await GenerateSalt();

    const userPassword = await GeneratePassword(newPassword, salt);

    return await this.repository.changePassword(userId, userPassword, salt);
  }

  async managePrivateAccount(userId) {
    const userData = await this.repository.findUserById(userId);
    userData.privateAccount = !userData.privateAccount;
    return await userData.save();
  }

  async manageFollowRequest({ senderId, action }, userId) {
    const userData = await this.repository.findUserById(userId);
    if (action) {
      userData.followers.push(senderId);
      userData.followRequests = userData.followRequests.filter(
        (requestId) => requestId.toString() !== senderId
      );
      const updatedUser = await userData.save();
      const removePayload = {
        event: "REMOVE_NOTFICATION",
        data: {
          sender: senderId,
          recipient: userId,
          type: "followRequest",
        },
      };
      const payload = {
        event: "NEW_NOTIFICATION",
        data: {
          type: "follow",
          sender: senderId,
          recipient: userId,
          content: `started following you.`,
        },
      };

      return { data: updatedUser, payload, removePayload };
    } else {
      console.log(userData.followRequests);
      userData.followRequests = userData.followRequests.filter(
        (requestId) => requestId.toString() !== senderId
      );
      const updatedUser = await userData.save();

      const removePayload = {
        event: "REMOVE_NOTFICATION",
        data: {
          sender: senderId,
          recipient: userId,
          type: "followRequest",
        },
      };
      return { data: updatedUser, removePayload };
    }
  }

  // RPC Response
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "GET_USERS":
        return this.repository.getUsers();
        break;
      case "HANDLE_BLOCK":
        return this.repository.handleBlock(data);
        break;
      case "GET_USERS_WITH_ID":
        return this.repository.getUsersWithId(data);
        break;
      case "GET_USER":
        return this.repository.findUserById(data);
        break;
        case "GET_EVENT_iNVITES":
          return this.repository.getEventInvites(data)
          break;
      default:
        break;
    }
  }
}

module.exports = UserService;
