import createUploader from './base.upload';

export const userProfileUpload = createUploader(
    1, 
    true, 
    'users/profiles',
    ['image/'],
    'profile_picture'
);
