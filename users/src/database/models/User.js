const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: { type: String },
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    salt: String,
    location: String,
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    coverPic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    bio: String,
    isVerified: Boolean,
    isActive: { type: Boolean, default: true },
    following: [Schema.Types.ObjectId],
    followers: [Schema.Types.ObjectId],
    followRequests:[Schema.Types.ObjectId],
    savedPosts: [Schema.Types.ObjectId],
    garage: [
      {
        nickName: { type: String, required: true },
        model: String,
        year: Number,
        image: {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      },
    ],
    recentSearches: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    phone:{type:String},
    country:{type:String},
    gender:{type:String},
    dataOfBirth:{type:Date},
    privateAccount:{type:Boolean},
    

  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
