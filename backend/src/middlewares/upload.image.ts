// backend/src/middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = "src/uploads/shop_logos/";
    fs.mkdirSync(folderPath, { recursive: true }); // สร้าง folder ถ้ายังไม่มี
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + "-" + Math.random().toString(36).substring(2, 15) + path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage });

module.exports = upload;