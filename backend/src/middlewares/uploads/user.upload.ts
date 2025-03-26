import createUploader from './base.upload';

export const userProfileUpload = createUploader([
    {
      subfolder: 'users/profiles',
      allowedMimeTypes: ['image/'],
      name: 'profile_picture_url',
      maxCount: 1,
    }
  ]);


export const tempUserUpload = createUploader([
  {
    subfolder: 'users/profiles',
    allowedMimeTypes: ['image/'],
    name: 'profile_picture_url',
    maxCount: 1,
  },
  {
    subfolder: 'users/licenses',
    allowedMimeTypes: ['image/', 'application/pdf'],
    name: 'license_urls',
    maxCount: 5,
  }
]);