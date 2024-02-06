const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventInvitesSchema = new Schema(
  {
    senderUserId: { type: Schema.Types.ObjectId },
    receiverUserId: { type: Schema.Types.ObjectId },
    eventId: { type: Schema.Types.ObjectId, ref: "event" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("eventInvites", EventInvitesSchema);
