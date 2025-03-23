import createUploader from './base.upload';

// สร้าง middleware สำหรับอัปโหลดรูปภาพของ gym
export const gymImagesUpload = createUploader([
  {
    subfolder: 'gyms',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    name: 'gym_image_urls',
    maxCount: 10,
  }
]); 
