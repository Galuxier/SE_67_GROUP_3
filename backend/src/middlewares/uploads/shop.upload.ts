// import createUploader from './base.upload';

// export const shopLogoUpload = createUploader(
//   1, // จำนวนไฟล์สูงสุดที่อนุญาต
//   true, // single file upload
//   'shops/logos', // subfolder สำหรับเก็บไฟล์โลโก้
//   ['image/'], // อนุญาตเฉพาะไฟล์รูปภาพ
//   'logo' // field name ที่ใช้ใน form-data
// );

// export const shopLicenseUpload = createUploader(
//   1, // จำนวนไฟล์สูงสุดที่อนุญาต
//   true, // single file upload
//   'shops/licenses', // subfolder สำหรับเก็บไฟล์ใบอนุญาต
//   ['image/'], // อนุญาตเฉพาะไฟล์รูปภาพ
//   'license' // field name ที่ใช้ใน form-data
// );


import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createMultiFieldUploader = (
  fields: { name: string; maxCount: number }[],
  baseFolder = '',
  allowedMimeTypes: string[] = ['image/']
) => {
  const baseUploadPath = path.join(__dirname, '../../uploads', baseFolder);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let subfolder = '';
      if (file.fieldname === 'logo') {
        subfolder = 'logos';
      } else if (file.fieldname === 'license') {
        subfolder = 'licenses';
      }

      const uploadPath = `uploads/${baseFolder}/${subfolder}`;
      fs.mkdirSync(uploadPath, { recursive: true });

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

  return upload.fields(fields);
};

export default createMultiFieldUploader;
