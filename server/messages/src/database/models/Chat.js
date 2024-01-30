const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean, default: false },
    users: [Schema.Types.ObjectId],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "message",
    },
    groupAdmin: { type: Schema.Types.ObjectId},
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", ChatSchema);
