const {
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
  GenerateSignature,
  SendVerifyMail,
  RPCRequest,
} = require("../utils");
const { EventRepository } = require("../database");

const cloudinary = require("../utils/cloudinary");

//All business logic will be here
class EventService {
  constructor() {
    this.repository = new EventRepository();
  }
  async createEvent(req) {
    console.log(req.body);
    const eventData = {
      ...req.body,
      createrId: req.user._id,
      going: [req.user._id],
    };

    if (req.body.image) {
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "events",
      });

      eventData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    const newEvent = this.repository.createEvent(eventData);
    return newEvent;
  }

  async getEvents(req) {
    return await this.repository.getEvents(req.user._id);
  }
  async getEventById(eventId) {
    const eventData = await this.repository.getEventById(eventId);
    const createrData = await RPCRequest("USERS_RPC", {
      type: "GET_USER",
      data: eventData.createrId,
    });
    eventData.creater = createrData;
    return eventData;
  }
  async respondEvent(req) {
    const response = req.body.response;
    return await this.repository.respondEvent(
      response,
      req.body.eventId,
      req.user._id
    );
  }
  async getEventsWithType(req) {
    console.log(req.query)
    if (req.query.selectedType === "invites") {
      return this.repository.getInvitesById(req.user._id);
    }
    return await this.repository.getEventsBySpecificType(
      req.query.selectedType,
      req.user._id
    );
  }

  async inviteEvent(req) {
    const { selectedUsersIds,eventId } = req.body;
    return await this.repository.createInvitations(eventId,req.user._id,selectedUsersIds);
  }
}

module.exports = EventService;
