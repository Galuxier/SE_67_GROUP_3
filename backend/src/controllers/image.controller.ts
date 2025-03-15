import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const serveImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // ดึง path ทั้งหมดจาก wildcard parameter
    const imagePath = req.params[0]; // เช่น "gyms/1741725685968-gym_images.png"

    // ตรวจสอบว่า imagePath มีค่าหรือไม่
    if (!imagePath) {
      res.status(400).json({ success: false, error: 'Image path is required' });
      return;
    }

    // สร้าง full path ของรูปภาพ
    const fullImagePath = path.join(__dirname, '../uploads', imagePath);

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if (!fs.existsSync(fullImagePath)) {
      res.status(404).json({ success: false, error: 'Image not found' });
      return;
    }

    // ส่งไฟล์รูปภาพกลับไปยัง client
    res.sendFile(fullImagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
