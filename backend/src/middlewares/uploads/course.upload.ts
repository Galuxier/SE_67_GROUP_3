import createUploader from './base.upload';

export const courseImagesUpload = createUploader([
    {
      subfolder: 'courses',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      name: 'course_image_url',
      maxCount: 1,
    }
  ]); 
