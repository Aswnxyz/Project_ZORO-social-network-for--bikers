const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "chat" },
    readBy: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
