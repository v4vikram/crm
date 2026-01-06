require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/crm_db',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  env: process.env.NODE_ENV || 'development',
  accessTokenMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (cookie)
};

module.exports = config;
