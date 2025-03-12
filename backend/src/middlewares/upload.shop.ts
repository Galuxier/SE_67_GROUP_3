import multer from "multer";
import path from "path";

// ตั้งค่า storage สำหรับ Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // บันทึกไฟล์ในโฟลเดอร์ uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "Test-" + uniqueSuffix + path.extname(file.originalname)); // ตั้งชื่อไฟล์ให้ไม่ซ้ำ
  },
});

// ตั้งค่า Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ไม่เกิน 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

export const uploadMiddleware = upload.fields([
  { name: 'logo', maxCount: 1 }, // รับไฟล์จาก field ชื่อ 'logo'
  { name: 'license', maxCount: 1 }, // รับไฟล์จาก field ชื่อ 'license'
]);