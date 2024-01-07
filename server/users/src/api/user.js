const UserService = require("../services/user-service");
const userAuth = require("./middlewares/auth");
const { RPCObserver, PublishMessage } = require("../utils");
const { NOTIFICATION_SERVICE } = require("../config");

module.exports = (app,channel) => {
  const service = new UserService();

  RPCObserver("USERS_RPC", service);

  app.post("/signup", async (req, res, next) => {
    try {
      const { userName, fullName, email, password } = req.body;
      const data = await service.signUp(
        { userName, fullName, email, password },
        res
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const userData = req.body;
      const data = await service.signIn(userData, res);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/verifyOtp", async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const data = await service.verifyOtp({ email, otp }, req);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/googleAuth", async (req, res, next) => {
    try {
      const decoded = req.body;
      const data = await service.googleAuth(decoded, res);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/getUser", userAuth, async (req, res, next) => {
    try {
      const data = await service.repository.findUserById(req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/profile", userAuth, async (req, res, next) => {
    try {
      const { userName } = req.body;
      const data = await service.getProfile(userName);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  app.post("/editProfile", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userData = req.body;
      const data = await service.updateProfile(_id, userData);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/logout", async (req, res, next) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return res.status(200).json({ message: "User logout " });
    } catch (error) {
      next(error);
    }
  });

  app.post("/followUser", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const {data,payload} = await service.followUser(req.body, _id);
      PublishMessage(channel,NOTIFICATION_SERVICE, JSON.stringify(payload));
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/getUsers", userAuth, async (req, res, next) => {
    try {
      const data = await service.getUsers(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/savePost", userAuth, async (req, res, next) => {
    try {
      const data = await service.savePost(req.body, req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/getSavedPosts",userAuth,async(req,res,next)=>{
    try {
      const data = await service.getSavedPosts(req.body);
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  });

  app.post("/createGarage",userAuth,async (req,res,next)=>{
    try {
      const data = await service.createGarage(req.body,req.user._id);

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  })
  app.get("/searchUsers",userAuth,async(req,res,next)=>{
    try {
     const data = await service.repository.searchUser(req.query);
     res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  });

  app.post("/addRecentSearch",userAuth,async(req,res,next)=>{
    try {
      const data = await service.addToRecentSearch(req.body,req.user._id);
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  })

  app.get("/getRecentSearches",userAuth,async(req,res,next)=>{
    try {
      const data = await service.getRecentUsers(req.user._id);
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  });

  app.delete("/clearRecentSearch",userAuth,async(req,res,next)=>{
    try {
      const data = await service.clearRecentSearch(req.user._id);
      return res.json(data)
    } catch (error) {
      next(error)
    }
  });
  app.get("/getUserDataWithMessages", userAuth, async (req, res, next) => {
    try {
      const data = await service.getUserDataWithMessages(req.query.userId,req.user._id)
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
