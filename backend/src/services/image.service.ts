import path from 'path';
import fs from 'fs';

export const ImageService = {
  getImagePath: (imageName: string) => {
    try {
      // Check if the imageName is valid
      if (!ImageService.isValidImage(imageName)) {
        throw new Error('Invalid image format');
      }

      // Create full path of the image
      const imagePath = path.join(__dirname, '../../uploads', imageName);

      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        // Log a safer message without exposing the full path
        console.log(`Image not found: ${imageName}`);
        throw new Error('Image not found');
      }

      return imagePath;
    } catch (error) {
      // Re-throw the error for the caller to handle
      throw error;
    }
  },

  isValidImage: (imageName: string) => {
    // Check if imageName has a value
    if (!imageName) {
      return false;
    }

    // Validate file extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const ext = path.extname(imageName).toLowerCase();
    return validExtensions.includes(ext);
  },
  
  // You might also want to add a helper for safe path validation
  isSafePath: (imageName: string) => {
    // Prevent directory traversal attacks
    return !imageName.includes('..');
  }
};