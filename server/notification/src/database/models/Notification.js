const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "follow",
      "like",
      "comment",
      "mention",
      "post",
      "commentLike",
      "followRequest",
    ],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentDetails: {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    mentionSnippet: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("notification", NotificationSchema);
