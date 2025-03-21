import createUploader from './base.upload';

export const userProfileUpload = createUploader([
    {
      subfolder: 'users/profiles',
      allowedMimeTypes: ['image/'],
      name: 'profile_picture_url',
      maxCount: 1,
    }
  ]);