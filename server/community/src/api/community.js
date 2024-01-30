const CommunityService = require("../services/community-service");
const userAuth = require("./middlewares/auth");
const { RPCObserver, PublishMessage } = require("../utils");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (app, channel) => {
  const service = new CommunityService();
  RPCObserver("COMMUNITY_RPC", service);

  app.post(
    "/createCommunity",
    userAuth,

    async (req, res, next) => {
      try {
        const data = await service.createCommunity(req);
        return res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  );
  app.get("/getCommunites",userAuth,async(req,res,next)=>{
    try {
        const data = await service.getCommunities(req.user._id);
        return res.status(200).json(data)
    } catch (error) {
        next(error)
    }
  });
  app.get("/getCommunityWithId",userAuth,async(req,res,next)=>{
    try {
        const data = await service.getCommunityDetails(req.query.communityId);
        return res.status(200).json(data)
    } catch (error) {
        next(error)
    }
  });

  app.get('/getAllCommunities',userAuth,async(req,res,next)=>{
    try {
      const data  = await service.repository.getAllCommunities(req.user._id);
      return res.status(200).json(data)
    } catch (error) {
       next(error)
    }
  })

  app.put("/joinCommunity",userAuth,async(req,res,next)=>{
    try {
      const data = await service.joinCommunity(req);
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  });

  app.get("/searchCommunity", userAuth, async (req, res, next) => {
    try {
      const data = await service.repository.searchCommunities(req.query);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
