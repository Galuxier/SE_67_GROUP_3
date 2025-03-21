import multer from 'multer';
import path from 'path';
import fs from 'fs';

interface UploadField {
  subfolder: string;
  allowedMimeTypes?: string[];
  name: string;
  maxCount?: number;
}

const createUploader = (fields: UploadField[]) => {
  // สร้างโฟลเดอร์ตาม field ที่กำหนด
  fields.forEach((field) => {
    const uploadPath = path.join(__dirname, '../../../uploads', field.subfolder);
    fs.mkdirSync(uploadPath, { recursive: true });
  });

  // กำหนด storage สำหรับ multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const field = fields.find((f) => f.name === file.fieldname);
      if (field) {
        const uploadPath = path.join(__dirname, '../../../uploads', field.subfolder);
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
        cb(null, uploadPath);
      } else {
        cb(new Error(`Invalid fieldname: ${file.fieldname}`) as unknown as null, '');
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${file.fieldname}${ext}`;
      cb(null, filename);
    },
  });

  // กำหนด filter สำหรับ file type
  const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const field = fields.find((f) => f.name === file.fieldname);
    if (field) {
      if (!field.allowedMimeTypes || field.allowedMimeTypes.length === 0 || 
          field.allowedMimeTypes.some((type) => file.mimetype.startsWith(type))) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type for ${file.fieldname}, only ${field.allowedMimeTypes?.join(', ')} allowed!`));
      }
    } else {
      cb(new Error(`Invalid fieldname: ${file.fieldname}`));
    }
  };

  // สร้าง multer instance
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  // สร้าง middleware ที่รวม multer และการแปลง path
  const uploadAndProcessPaths = (req: any, res: any, next: any) => {
    // ใช้ multer สำหรับ upload
    const multerMiddleware = upload.fields(
      fields.map((field) => ({
        name: field.name,
        maxCount: field.maxCount || 1,
      }))
    );

    multerMiddleware(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // ถ้าไม่มีไฟล์ที่อัพโหลด ให้ทำงานต่อ
      if (!req.files || Object.keys(req.files).length === 0) {
        return next();
      }

      // แปลง req.files เป็น paths ที่เตรียมไว้สำหรับบันทึกลง DB
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // สร้าง object สำหรับเก็บ paths
      for (const fieldname in files) {
        const fieldFiles = files[fieldname];
        const field = fields.find(f => f.name === fieldname);
        
        if (field && fieldFiles && fieldFiles.length > 0) {
          // ถ้ามี file เดียว
          if (fieldFiles.length === 1) {
            const relativePath = fieldFiles[0].path.replace(/^.*?uploads[\/\\]/, '');
            // สร้าง field ใน req.body ตามชื่อ field
            req.body[`${fieldname}`] = relativePath;
          } 
          // ถ้ามีหลาย file
          else if (fieldFiles.length > 1) {
            const relativePaths = fieldFiles.map(file => 
              file.path.replace(/^.*?uploads[\/\\]/, '')
            );
            // สร้าง field ใน req.body ตามชื่อ field
            req.body[`${fieldname}`] = relativePaths;
          }
        }
      }

      // ทำงานต่อไปยัง middleware ถัดไปหรือ controller
      next();
    });
  };

  return uploadAndProcessPaths;
};

export default createUploader;