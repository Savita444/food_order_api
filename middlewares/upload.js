const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define directory for uploads
const uploadPath = path.join(__dirname, '../uploads/hotel_docs');

// Create the folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create the multer instance
const upload = multer({ storage });

// Export the multer instance
module.exports = upload;
