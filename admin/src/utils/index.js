const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APP_SECRET, EXCHANGE_NAME } = require("../config");
const { v4: uuid4 } = require("uuid");
const amqplib = require("amqplib");
const {MSG_QUEUE_URL} = require("../config")

let amqplibConnection = null;

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async ( res,payload) => {
  const token = jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  res.cookie("admin_jwt", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== "dev",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return token;
};
module.exports.ValidateSignature = async (req) => {
  const signature = req.get("Authorization") || req.cookies.admin_jwt;
  if (signature) {
    const payload = await jwt.verify(signature, APP_SECRET);
    req.admin = payload;
    return true;
  }
  return false;
};





//MESSAGE_BROKER

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

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) =>{
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
        console.log(error)
    }
}


module.exports.RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};
