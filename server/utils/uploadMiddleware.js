const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Set up Cloudinary storage for uploaded files
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lost-and-found", // Folder in Cloudinary to store images
    allowed_formats: ["jpeg", "jpg", "png", "gif"],
    transformation: [
      { width: 800, height: 600, crop: "limit" }, // Resize images to max 800x600
      { quality: "auto" }, // Automatic quality optimization
    ],
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images only (jpeg, jpg, png, gif)!");
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
