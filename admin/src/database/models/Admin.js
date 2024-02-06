const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    name: {type:String},
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", AdminSchema);
