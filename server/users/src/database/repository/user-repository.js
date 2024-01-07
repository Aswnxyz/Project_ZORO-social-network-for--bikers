const { UserModel, UserOtpModel } = require("../models");
const mongoose = require("mongoose");

//Dealing with database operations
class UserRepository {
  async createUser({ userName, fullName, email, password, salt }) {
    const user = new UserModel({
      userName,
      fullName,
      email,
      password,
      salt,
      garage: [],
      following: [],
      follwers: [],
    });
    const userData = await user.save();
    return userData;
  }

  async findUser({ email }) {
    const existingUser = await UserModel.findOne({ email });
    return existingUser;
  }
  async findUserWithEmailOrUserName({ email, userName }) {
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { userName }],
    });
    return existingUser;
  }

  async findUserByUsername(userName) {
    return await UserModel.findOne({ userName });
  }

  async findUserById(id) {
    return await UserModel.findById(id);
  }

  async findOtp(id) {
    const existingUser = await UserOtpModel.findOne({ user_Id: id });
    return existingUser;
  }
  async verifyUser(id) {
    await UserModel.updateOne({ _id: id }, { isVerified: true });
  }
  async clearOtp(id) {
    await UserOtpModel.deleteMany({ user_Id: id });
  }

  async getUsers() {
    const usersData = await UserModel.find({});
    return usersData;
  }

  async handleBlock({ _id, type }) {
    // const existingUser = await UserModel.findById(_id);

    if (type === "block") {
      let updatedUser = await UserModel.findOneAndUpdate(
        { _id },
        { isActive: false },
        { new: true }
      );
      return updatedUser;
    } else {
      let updatedUser = await UserModel.findOneAndUpdate(
        { _id },
        { isActive: true },
        { new: true }
      );
      return updatedUser;
    }
  }

  async getUsersWithId(userIds) {
    return await UserModel.find({ _id: { $in: userIds } }).lean();
  }

  async followUser(userName, userId) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { userName },
      { $addToSet: { followers: userId } },
      { new: true }
    );
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { following: updatedUser._id } }
    );
    return updatedUser;
  }
  async unfollowUser(userName, userId) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { userName },
      { $pull: { followers: userId } },
      { new: true }
    );
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { following: updatedUser._id } }
    );
    return updatedUser;
  }

  async updateSavedPost(postId, userId) {
    const user = await this.findUserById(userId);
    if (user.savedPosts.includes(postId)) {
      return await UserModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedPosts: postId } },
        { new: true }
      );
    } else {
      return await UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { savedPosts: postId } },
        { new: true }
      );
    }
  }

  async createGarage(nickName, year, model, userId, result) {
    const newGarageEntry = {
      nickName,
      model,
      year,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };

    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { garage: newGarageEntry } },
      { new: true }
    );

    return newGarageEntry;
  }

  async searchUser({ searchInput }) {
    if (!searchInput) return [];
    const users = await UserModel.find({
      $or: [
        { userName: { $regex: `^${searchInput}`, $options: "i" } },
        { fullName: { $regex: `^${searchInput}`, $options: "i" } },
      ],
    });

    return users;
  }

  async addRecentSearch(userId, _id) {
    await UserModel.findByIdAndUpdate(_id, {
      $pull: {
        recentSearches: { userId: userId }, // Remove entry with the specified userId
      },
    });

    return await UserModel.findByIdAndUpdate(
      _id,
      {
        $addToSet: {
          recentSearches: { userId },
        },
      },
      { new: true }
    );
  }

  async getRecentUsers(userId) {
    const userIdObject = new mongoose.Types.ObjectId(userId);
    // const user = await UserModel.aggregate([
    //   { $match: { _id: userIdObject } },
    //   { $unwind: "$recentSearches" }, // Unwind the recentSearches array
    //   {
    //     $group: {
    //       _id: null,
    //       userIds: { $addToSet: "$recentSearches.userId" },
    //     },
    //   },
    //   { $project: { _id: 0, userIds: 1 } },
    // ]);
    const user = await UserModel.aggregate([
      { $match: { _id: userIdObject } },
      { $unwind: "$recentSearches" },
      {
        $group: {
          _id: "$recentSearches.userId",
          latestTimestamp: { $max: "$recentSearches.timestamp" },
        },
      },
      { $sort: { latestTimestamp: -1 } },
      { $project: { _id: 1 } },
    ]);

    // Convert the string representation of ObjectIDs to actual ObjectIDs
    const allUserIds = user.map((user) =>
     new mongoose.Types.ObjectId(user._id)
    );

    // const allUserIds = user.length > 0 ? user[0].userIds : [];
    
    return allUserIds;
  }

  async clearRecentSearch(userId){
   return  await UserModel.findByIdAndUpdate(
      userId,
      { $set: { recentSearches: [] } },
      { new: true } // Returns the updated document
    );
  }
}

module.exports = UserRepository;
