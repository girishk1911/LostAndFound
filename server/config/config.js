require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pict-lostfound',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRE: '8h',
  // Hardcoded guard credentials (in production, store hashed password)
  GUARD_CREDENTIALS: {
    username: 'pict_guard',
    password: 'secure@guard123'
  },
  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL || 'lostandfound@pict.edu',
  FROM_NAME: process.env.FROM_NAME || 'PICT Lost & Found'
};