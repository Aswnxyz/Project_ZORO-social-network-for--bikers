const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"], // Specify the allowed HTTP methods
      credentials: true,
    },
  });

  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel, io);

  //watch all errors and formate and report to logger
  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });

  httpServer
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};
startServer();
