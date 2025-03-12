import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createUploader = (
  maxCount: number,
  isSingle = false,
  subfolder = '',
  allowedMimeTypes: string[] = ['image/'],
  fieldName = 'file'
) => {
  const uploadPath = path.join(__dirname, '../../uploads', subfolder);

  // สร้างโฟลเดอร์ถ้ายังไม่มี
  fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${file.fieldname}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (allowedMimeTypes.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type, only ${allowedMimeTypes.join(', ')} allowed!`));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  // 👉 ใช้ fieldName ที่กำหนดแทน 'file' หรือ 'files'
  return isSingle
    ? upload.single(fieldName)
    : upload.array(fieldName, maxCount);
};

export default createUploader;