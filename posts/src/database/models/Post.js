const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    des: String,
    // media: {
    //   public_id: {
    //     type: String,
    //   },
    //   url: {
    //     type: String,
    //   },
    // },
    media:String,
    reported: [{ reason: { type: String, required: true }, userName: String }],
    likes: [Schema.Types.ObjectId],
    isActive: { type: Boolean, default: true },
    isCommunityPost:{type:Boolean,default:false},
    communityId:{type:Schema.Types.ObjectId}
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
