const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { message } = require("./api");

module.exports = async (app, channel,io) => {
  app.use(
    cors({
      origin: ["http://localhost:5173","https://zoro.shopzen.in.net"],
      methods: ["GET", "POST", "PUT", "DELETE"], // Add the allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
      credentials: true, // Enable credentials (if needed)
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use(express.static(__dirname + "/public"));

  //api
  message(app, channel,io);
};
