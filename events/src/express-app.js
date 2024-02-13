const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { event } = require("./api");
const { CreateChannel } = require("./utils");

module.exports = async (app) => {
  app.use(
    cors({
      origin: ["http://localhost:5173","https://zoro.shopzen.in.net"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Add the allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // Add allowed headers
      credentials: true, // Enable credentials (if needed)
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  app.use(express.static(__dirname + "/public"));

  const channel = await CreateChannel();

  //api
  event(app, channel);
};
