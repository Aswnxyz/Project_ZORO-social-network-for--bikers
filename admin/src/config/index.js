const dotEnv = require("dotenv");
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI + "zoro_admin",
  APP_SECRET: process.env.JWT_SECRET,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
};
