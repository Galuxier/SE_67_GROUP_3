import createUploader from './base.upload';

export const shopUpload = createUploader([
  {
    subfolder: 'shops/logos',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    name: 'logo_url',
    maxCount: 1,
  },
  {
    subfolder: 'shops/license',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    name: 'license',
    maxCount: 1,
  }
]); 
