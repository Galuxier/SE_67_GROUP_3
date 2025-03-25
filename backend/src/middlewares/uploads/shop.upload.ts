import createUploader from './base.upload';

export const shopUpload = createUploader([
  {
    subfolder: 'shops/logos',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    name: 'logo_url',
    maxCount: 1,
  }
]); 


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

