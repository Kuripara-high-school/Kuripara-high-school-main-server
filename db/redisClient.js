require("dotenv").config();
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error :', err));

// Immediately connect
(async () => {
    await redisClient.connect();
    console.log('Connected to Redis Cloud');
})();

module.exports = redisClient;