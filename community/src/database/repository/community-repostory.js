const mongoose = require("mongoose");
const { CommunityModel } = require("../models");

//Dealing with database operations
class CommunityRepository {
  async createCommunity(communityData) {
    return await CommunityModel.create(communityData);
  }
  async getCommunities(userId) {
    return await CommunityModel.find({
      members: { $elemMatch: { $eq: userId } },
    }).sort({ createdAt: -1 });
  }
  async getCommunityWithId(communityId) {
    return await CommunityModel.findById(communityId);
  }
  async getAllCommunities(userId) {
    return await CommunityModel.find({ members: { $nin: [userId] } });
  }
  async joinCommunity(communityId, userId) {
    const existingCommunity = await this.getCommunityWithId(communityId);
    if (!existingCommunity.members.includes(userId)) {
      return await CommunityModel.findByIdAndUpdate(
        communityId,
        { $addToSet: { members: userId } },
        { new: true }
      );
    } else {
      return await CommunityModel.findByIdAndUpdate(
        communityId,
        { $pull: { members: userId } },
        { new: true }
      );
    }
  }

  async getComminitiesWithId(communityIds) {
    return await CommunityModel.find({ _id: { $in: communityIds } }).lean();
  }
  async searchCommunities({ searchInput }) {
    if (!searchInput) return [];
    const communities = await CommunityModel.find({
      $or: [
        { name: { $regex: `^${searchInput}`, $options: "i" } },
      
      ],
    });

    return communities;
  }
}
module.exports = CommunityRepository;
