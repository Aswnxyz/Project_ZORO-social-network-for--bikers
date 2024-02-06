const mongoose = require("mongoose");
const { EventModel, EventInvitesModel } = require("../models");

//Dealing with database operations
class EventRepository {
  async createEvent(eventData) {
    return await EventModel.create(eventData);
  }
  async getEvents(userId) {
    console.log(userId);
    return await EventModel.find({
      $nor: [{ going: userId }, { interested: userId }],
    });
  }

  async getEventById(eventId) {
    return await EventModel.findOne({ _id: eventId }).lean();
  }
  async respondEvent(responseType, eventId, userId) {
    try {
      const event = await EventModel.findById(eventId);

      if (!event) {
        // Handle event not found
        console.log("Event not found");
        return;
      }

      const goingIndex = event.going.indexOf(userId);
      const interestedIndex = event.interested.indexOf(userId);

      if (responseType === "going") {
        // Toggle from interested to going
        if (interestedIndex !== -1) {
          event.interested.splice(interestedIndex, 1);
        }

        if (goingIndex === -1) {
          event.going.push(userId);
        }
      } else if (responseType === "interested") {
        // Toggle from going to interested
        if (goingIndex !== -1) {
          event.going.splice(goingIndex, 1);
        }

        if (interestedIndex === -1) {
          event.interested.push(userId);
        }
      } else {
        // Remove user from both going and interested
        if (goingIndex !== -1) {
          event.going.splice(goingIndex, 1);
        }

        if (interestedIndex !== -1) {
          event.interested.splice(interestedIndex, 1);
        }
      }

      console.log("Toggle response successful");
      return await event.save();
    } catch (error) {
      console.error("Error toggling response:", error);
      // Handle error
    }
  }
  async getEventsBySpecificType(selectedType, userId) {
    if (selectedType === "going") {
      return await EventModel.find({ going: userId }).sort({ startDate: -1 });
    } else if (selectedType === "interested") {
      return await EventModel.find({ interested: userId }).sort({
        startDate: -1,
      });
    } else if (selectedType === "hosting") {
      return await EventModel.find({ createrId: userId }).sort({
        startDate: -1,
      });
    }
  }
  async getEventsWithIds(eventIds) {
    return await EventModel.find({ _id: { $in: { eventIds } } });
  }
  async createInvitations(eventId, senderUserId, selectedUsersIds) {
    const invitations = [];

    for (const receiverUserId of selectedUsersIds) {
      const invitation = new EventInvitesModel({
        eventId,
        senderUserId,
        receiverUserId,
      });

      invitations.push(invitation);
    }
    const savedInvitations = await EventInvitesModel.insertMany(invitations);
    return { success: true };
  }
  async getInvitesById(userId) {
    const data = await EventInvitesModel.find({ receiverUserId: userId })
      .populate("eventId")
      .sort({ createdAt: -1 });
    console.log(data);
    const events = data.map((invite) => invite.eventId);
    return events
  }
}
module.exports = EventRepository;
