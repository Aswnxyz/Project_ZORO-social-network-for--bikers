const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommunitySchema = new Schema(
  {
    name: { type: String },

    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    members: [Schema.Types.ObjectId],
    communityAdmin:{type:Schema.Types.ObjectId}
  },
  { timestamps: true }
);

module.exports = mongoose.model("community", CommunitySchema);
