import fs from 'fs';
import path from 'path';

export const getImage = (imageName: string) => {
  const imagePath = path.join(__dirname, '../uploads', imageName);

  // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
  if (!fs.existsSync(imagePath)) {
    throw new Error('Image not found');
  }

  return imagePath;
};