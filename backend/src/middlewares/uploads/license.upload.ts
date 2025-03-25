import createUploader from './base.upload';

export const licenseUpload = createUploader([
  {
    subfolder: 'users/licenses',
    allowedMimeTypes: ['image/', 'application/pdf'],
    name: 'license_urls',
    maxCount: 5,
  }
]);