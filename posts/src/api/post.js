const PostService = require("../services/post-service");
const userAuth = require("./middlewares/auth");
const { RPCObserver, PublishMessage } = require("../utils");
const { NOTIFICATION_SERVICE } = require("../config");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = (app, channel) => {
  const service = new PostService();

  RPCObserver("POSTS_RPC", service);

  app.post("/createPost", userAuth,upload.single("image"), async (req, res, next) => {
    try {
      console.log("req.body", req.body);
      console.log("req.file", req.file);
      const des = req.body.des;
      const image = req.file.buffer
      const data = await service.createPost(req,req.user._id)
      return res.json({})

      // const postData = req.body;
      // const { _id } = req.user;

      // const data = await service.createPost(postData, _id);

      // return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/getPosts", userAuth, async (req, res, next) => {
    try {
      const data = await service.getPosts(req.query);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/likePost", userAuth, async (req, res, next) => {
    try {
      const { data, payload } = await service.handleLikePost(req.body);
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/commentPost", userAuth, async (req, res, next) => {
    try {
      const { data, payload } = await service.commentPost(
        req.body,
        req.user._id
      );
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/getComments", userAuth, async (req, res, next) => {
    const { _id } = req.body;
    try {
      const data = await service.getComments(_id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/likeComment", userAuth, async (req, res, next) => {
    try {
      const data = await service.handleLikeComment(req.body, req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/reportPost", userAuth, async (req, res, next) => {
    try {
      const data = await service.reportPost(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/deletePost", userAuth, async (req, res, next) => {
    try {
      const data = await service.repository.deletePost(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/editPost", userAuth, async (req, res, next) => {
    try {
      const data = await service.repository.editPost(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/deleteComment", userAuth, async (req, res, next) => {
    try {
      const { data, payload } = await service.deleteComment(
        req.body,
        req.user._id
      );
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
