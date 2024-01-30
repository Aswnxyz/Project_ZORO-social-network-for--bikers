const EventService = require("../services/event-services");
const userAuth = require("./middlewares/auth");
const { RPCObserver, PublishMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new EventService();
  app.post("/createEvent", userAuth, async (req, res, next) => {
    try {
      const data = await service.createEvent(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
  app.get("/getEvents", userAuth, async (req, res, next) => {
    try {
      const data = await service.getEvents(req);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/getEventById", userAuth, async (req, res, next) => {
    try {
      const data = await service.getEventById(req.query.eventId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/respondEvent", userAuth, async (req, res, next) => {
    try {
      const data = await service.respondEvent(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/getEventsFromType", userAuth, async (req, res, next) => {
    try {
      const data = await service.getEventsWithType(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/inviteToEvent", userAuth, async (req, res, next) => {
    try {
      const data = await service.inviteEvent(req);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
