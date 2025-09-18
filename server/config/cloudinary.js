const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxqirkx5m',
  api_key: process.env.CLOUDINARY_API_KEY || '839181327468946',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Ifw55BajFeuxa1LqNTVqIy30BRU'
});

module.exports = cloudinary;dinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dxqirkx5m",
  api_key: "839181327468946",
  api_secret: "Ifw55BajFeuxa1LqNTVqIy30BRU",
});

module.exports = cloudinary;
