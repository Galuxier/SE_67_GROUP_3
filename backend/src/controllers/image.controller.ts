import { Request, Response } from 'express';
import { getImage } from '../services/image.service';

export const serveImage = async (req: Request, res: Response) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = getImage(imageName);

    // ส่งไฟล์รูปภาพกลับไปยัง client
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(404).json({ success: false, error: error });
  }
};