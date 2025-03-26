import createUploader from './base.upload';

export const placeImagesUpload = createUploader([
    {
      subfolder: 'places',
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      name: 'place_image_urls',
      maxCount: 10,
    }
  ]); 
