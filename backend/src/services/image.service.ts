import path from 'path';
import fs from 'fs';

export const ImageService = {
  getImagePath: (imageName: string) => {
    try {
      // สร้าง full path ของรูปภาพ
      const imagePath = path.join(__dirname, '../uploads', imageName);

      // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
      if (!fs.existsSync(imagePath)) {
        console.log(imagePath);
        throw new Error('Image not found');
      }

      return imagePath;
    } catch (error) {
      throw error;
    }
  },

  isValidImage: (imageName: string) => {
    // ตรวจสอบว่า imageName มีค่าหรือไม่
    if (!imageName) {
      return false;
    }

    // ตรวจสอบนามสกุลไฟล์
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const ext = path.extname(imageName).toLowerCase();
    return validExtensions.includes(ext);
  },
};