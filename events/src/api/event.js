const EventService = require("../services/event-services");
const userAuth = require("./middlewares/auth");
const { RPCObserver, PublishMessage } = require("../utils");
const express = require("express");

module.exports = (app, channel) => {
  const service = new EventService();
  const router = express.Router();
  router.post("/createEvent", userAuth, async (req, res, next) => {
    try {
      const data = await service.createEvent(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  router.get("/getEvents", userAuth, async (req, res, next) => {
    try {
      const data = await service.getEvents(req);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/getEventById", userAuth, async (req, res, next) => {
    try {
      const data = await service.getEventById(req.query.eventId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  router.put("/respondEvent", userAuth, async (req, res, next) => {
    try {
      const data = await service.respondEvent(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/getEventsFromType", userAuth, async (req, res, next) => {
    try {
      const data = await service.getEventsWithType(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  router.post("/inviteToEvent", userAuth, async (req, res, next) => {
    try {
      const data = await service.inviteEvent(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  app.use("/api/event", router);
};
