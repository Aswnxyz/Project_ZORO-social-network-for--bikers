const {
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
  GenerateSignature,
  SendVerifyMail,
  RPCRequest,
} = require("../utils");
const { CommunityRepository } = require("../database");


const cloudinary = require("../utils/cloudinary");

//All business logic will be here
class CommunityService {
  constructor() {
    this.repository = new CommunityRepository();
  }

  async createCommunity(req) {
    const communityData = {
      name: req.body.communityName,
      members: [...req.body.selectedUsersIds, req.user._id],
      communityAdmin: req.user._id,
    };
    if (req.body.image) {
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "communities",
      });

      communityData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const newCommmunity = await this.repository.createCommunity(communityData);
    return newCommmunity;
  }

  async getCommunities(userId) {
    return this.repository.getCommunities(userId);
  }
  async getCommunityDetails(communityId) {
    const communityData = await this.repository.getCommunityWithId(communityId);
     const posts = await RPCRequest("POSTS_RPC", {
       type: "GET_COMMUNITY_POSTS_BY_ID",
       data: communityId,
     });
    return {communityData,posts}
  }
  async joinCommunity(req) {
    return await this.repository.joinCommunity(
      req.body.communityId,
      req.user._id
    );
  }

  

  // RPC Response
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "GET_COMMUNITIES_WITH_ID":
        return this.repository.getComminitiesWithId(data);
        break;

      default:
        break;
    }
  }
}

module.exports = CommunityService;
