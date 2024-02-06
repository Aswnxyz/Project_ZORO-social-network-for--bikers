const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserOTPVerificationSchema = new Schema({
  user_Id: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model("userOtpVerification",UserOTPVerificationSchema);
