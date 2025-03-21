// // base.upload.ts
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { Request, Response, NextFunction } from 'express';

// interface UploadField {
//   subfolder: string;
//   allowedMimeTypes?: string[];
//   name: string;
//   maxCount?: number;
// }

// // Define the structure of the multer File type - but don't redeclare Express namespace
// interface MulterFile {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   destination: string;
//   filename: string;
//   path: string;
//   size: number;
// }

// // Add only the simplePaths property to the Express namespace
// declare global {
//   namespace Express {
//     interface Request {
//       simplePaths?: {
//         [fieldname: string]: string | string[];
//       };
//     }
//   }
// }

// const createUploader = (fields: UploadField[]) => {
//   // Create folders based on field definitions
//   if (!Array.isArray(fields)) {
//     throw new TypeError('Fields must be an array of objects');
//   }

//   fields.forEach((field) => {
//     const uploadPath = path.join(__dirname, '../../uploads', field.subfolder);
//     fs.mkdirSync(uploadPath, { recursive: true });
//   });

//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const field = fields.find((f) => f.name === file.fieldname);
//       if (field) {
//         const uploadPath = path.join(__dirname, '../../uploads', field.subfolder);
//         cb(null, uploadPath);
//       } else {
//         cb(new Error(`Invalid fieldname: ${file.fieldname}`) as unknown as null, '');
//       }
//     },  
//     filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const filename = `${Date.now()}-${file.fieldname}${ext}`;
//       cb(null, filename);
//     },
//   });

//   const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     const field = fields.find((f) => f.name === file.fieldname);
//     if (field) {
//       if (field.allowedMimeTypes && field.allowedMimeTypes.some((type) => file.mimetype.startsWith(type))) {
//         cb(null, true);
//       } else {
//         cb(new Error(`Invalid file type for ${file.fieldname}, only ${field.allowedMimeTypes?.join(', ')} allowed!`));
//       }
//     } else {
//       cb(new Error(`Invalid fieldname: ${file.fieldname}`));
//     }
//   };

//   const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//       fileSize: 5 * 1024 * 1024, // 5MB
//     },
//   });

//   // Create the multer middleware
//   const multerMiddleware = upload.fields(
//     fields.map((field) => ({
//       name: field.name,
//       maxCount: field.maxCount || 1,
//     }))
//   );

//   // Create a wrapper middleware that transforms the files into simple paths
//   return (req: Request, res: Response, next: NextFunction) => {
//     // First run the multer middleware
//     multerMiddleware(req, res, (err) => {
//       if (err) {
//         return next(err);
//       }

//       // If no files were uploaded, continue
//       if (!req.files) {
//         return next();
//       }

//       try {
//         // Transform the files into simple paths
//         const simplePaths: Record<string, string | string[]> = {};

//         // Process each field using type assertion for req.files
//         const filesObject = req.files as { [fieldname: string]: MulterFile[] };
        
//         Object.keys(filesObject).forEach(fieldName => {
//           const field = fields.find(f => f.name === fieldName);
//           if (!field) return;

//           // Get the files for this field
//           const fieldFiles = filesObject[fieldName];
          
//           if (fieldFiles.length === 1) {
//             // For single file fields, store just the path
//             const fileName = fieldFiles[0].filename;
//             simplePaths[fieldName] = `${field.subfolder}/${fileName}`;
//           } else if (fieldFiles.length > 1) {
//             // For multiple files, store an array of paths
//             simplePaths[fieldName] = fieldFiles.map((file) => 
//               `${field.subfolder}/${file.filename}`
//             );
//           }
//         });

//         // Add the simple paths to the request object
//         req.simplePaths = simplePaths;
//       } catch (error) {
//         console.error('Error processing uploaded files:', error);
//       }
      
//       // Continue to the next middleware
//       next();
//     });
//   };
// };

// export default createUploader;

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
  // 👉 สร้างโฟลเดอร์ตาม fieldname ที่กำหนดใน fields
  fields.forEach((field) => {
    const uploadPath = path.join(__dirname, '../../uploads', field.subfolder);
    fs.mkdirSync(uploadPath, { recursive: true });
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const field = fields.find((f) => f.name === file.fieldname);
      if (field) {
        const uploadPath = path.join(__dirname, '../../uploads', field.subfolder);
        cb(null, uploadPath); // ✅ ใส่ค่าให้ถูกต้องตาม type definition
      } else {
        cb(new Error(`Invalid fieldname: ${file.fieldname}`) as unknown as null, ''); // ✅ ใส่ค่า argument ตัวที่สองให้ตรงกับ type
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${file.fieldname}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const field = fields.find((f) => f.name === file.fieldname);
    if (field) {
      if (field.allowedMimeTypes?.some((type) => file.mimetype.startsWith(type))) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type for ${file.fieldname}, only ${field.allowedMimeTypes?.join(', ')} allowed!`));
      }
    } else {
      cb(new Error(`Invalid fieldname: ${file.fieldname}`));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  // 👉 รองรับ fields ได้หลายตัว
  return upload.fields(
    fields.map((field) => ({
      name: field.name,
      maxCount: field.maxCount || 1,
    }))
  );
};

export default createUploader;
