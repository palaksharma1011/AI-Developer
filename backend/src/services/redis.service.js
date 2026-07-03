const Redis = require("ioredis");
const config = require("../config/config");

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

module.exports = redisClient;
