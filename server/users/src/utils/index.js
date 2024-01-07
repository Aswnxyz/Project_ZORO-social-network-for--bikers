const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const { APP_SECRET, MSG_QUEUE_URL, EXCHANGE_NAME } = require("../config");
const {UserOtpModel} = require("../database/models");
const amqplib = require("amqplib");
const { v4: uuid4 } = require("uuid");


let amqplibConnection = null;
//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
}
  module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
  }
  module.exports.ValidatePassword = async (
    enteredPassword,
    savedPassword,
    salt
  ) => {
    return (
      (await this.GeneratePassword(enteredPassword, salt)) === savedPassword
    );
  }
  module.exports.GenerateSignature = async (payload, res) => {
    const token =jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "dev",
      sameSite: "strict", 
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
  }
  module.exports.ValidateSignature = async (req) => {
    const signature = req.get("Authorization") || req.cookies.jwt;
    if (signature) {
      const payload = await jwt.verify(signature, APP_SECRET);
      req.user = payload;
      return true;
    }
    return false;
  }
  module.exports.SendVerifyMail = async (name, email, userId) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "shopzen105@gmail.com",
        pass: "ytxphxoibpxglflx",
      },
    });

    const mailOptions = {
      from: "shopzen105@gmail.com@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `Dear ${name},\n\nEnter <b>${otp}</b> in the app to verify you email address and complete the process.`,
    };
    await UserOtpModel.deleteMany({user_Id:userId});
    const newOTPverification = new UserOtpModel({
      user_Id: userId,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    await newOTPverification.save();

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};



//MESSAGE BROKER

const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(MSG_QUEUE_URL);
  }
  return await amqplibConnection.createChannel();
};

module.exports.CreateChannel = async () => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    console.log(err)
  }
};

module.exports.RPCObserver = async (RPC_QUEUE_NAME,service)=>{

  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME,{
    durable:false
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg)=>{
      if(msg.content){
        //DB_OPERATION
        const payload =JSON.parse(msg.content.toString());
        const response = await service.serveRPCRequest(payload);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg)
      }
    },
    {
      noAck:false,
    }
  )
}

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    const channel = await getChannel();
    const q = await channel.assertQueue("", { exclusive: true });
    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout n
      const timeout = setTimeout(() => {
        channel.close();
        resolve("API could not fullfil the request!");
      }, 8000);
      channel.consume(
        q.queue,
        (msg) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            reject("data Not found!");
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.PublishMessage = async (channel,service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};


module.exports.RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};
