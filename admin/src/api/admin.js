const AdminService = require("../services/admin-service");
const adminAuth = require("./middlewares/adminAuth")
const express = require("express");

module.exports = (app) => {
  const service = new AdminService();
  const router = express.Router();
  router.post("/login", async (req, res,next) => {
    try {
        const { email, password } = req.body;
    const data = await service.signIn(res, { email, password });
    return res.status(200).json(data);
    } catch (error) {
      next(error)
    }
  
  });
  router.post('/logout',(async (req,res,next)=>{
    try {
      res.cookie("admin_jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: "Admin logout " });
    } catch (error) {
      next(error);
    }
  }))
  router.get("/getUsers",adminAuth, async (req, res,next) => {
    try {
      const data = await service.getUsers();
    return res.status(200).json(data);
    } catch (error) {
      next(error)
    }
    
  });
  router.post("/handleBlock",adminAuth,async(req,res,next)=>{
    try {
       const {_id,type} = req.body;
    const data = await service.handleBlock(_id,type);
    return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
   
  });

  router.post("/getPosts",adminAuth,async (req,res,next)=>{
    try {
      const data = await service.getPosts(req.body);
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  })

  router.post("/handlePostBlock",adminAuth,async(req,res,next)=>{
    try {
      const data = await service.handlePostBlock(req.body)
      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  });

  app.use("/api/admin", router);
  
};
