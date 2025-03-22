import createUploader from './base.upload';

export const licenseUpload = createUploader([
  {
    subfolder: 'users/licenses',
    allowedMimeTypes: ['image/', 'spplication/pdf'],
    name: 'license_ulrs',
    maxCount: 5,
  }
]);