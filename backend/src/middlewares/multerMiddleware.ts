import multer from 'multer';

// ใช้ memory storage เพื่อไม่ต้องจัดเก็บไฟล์
const storage = multer.memoryStorage();

const multerMiddleware = multer({ storage }).none();

export default multerMiddleware;
