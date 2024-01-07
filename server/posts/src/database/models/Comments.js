const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userId: Schema.Types.ObjectId,
    postId: {
      type:Schema.Types.ObjectId,
      ref: "post", // Reference to the post model for linking comments to posts
      required: true,
    },
    likes: [Schema.Types.ObjectId],
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", CommentSchema);
