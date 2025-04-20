require('dotenv').config();

// Configuration settings for the application
module.exports = {
  // MongoDB connection URI
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lostAndFound',
  
  // JWT Secret for signing tokens
  jwtSecret: process.env.JWT_SECRET || 'pict_lost_and_found_secret_key',
  
  // Port for the server
  port: process.env.PORT || 5000,
  
  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',
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