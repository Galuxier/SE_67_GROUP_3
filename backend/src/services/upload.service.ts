import multer from 'multer';
import path from 'path';

// ตั้งค่า storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ตรวจสอบประเภทไฟล์
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed!'));
  }
};

// ตั้งค่า multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // จำกัดขนาดไฟล์ 5MB
});

export class UploadService {
  static handleUpload(fieldName: string, maxCount: number) {
    return upload.array(fieldName, maxCount);
  }
}