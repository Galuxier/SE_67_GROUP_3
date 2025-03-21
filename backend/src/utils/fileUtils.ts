// fileUtils.ts
import fs from 'fs';
import path from 'path';

export const deleteUploadedFile = (filePath: string): boolean => {
  try {
    const fullPath = path.join(__dirname, '../../uploads', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};