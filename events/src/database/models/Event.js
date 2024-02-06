const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    name: String,
    startDate: { type: Date },
    startTime: { type: String },
    endDate: { type: Date },
    endTime: { type: String },
    details: { type: String },
    createrId:{type:String},
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    interested: [Schema.Types.ObjectId],
    going: [Schema.Types.ObjectId],
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", EventSchema);
