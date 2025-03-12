import createUploader from './base.upload';

export const userLicenseUpload = createUploader(5, false, 'licenses', [
  'image/',
  'application/pdf', // รองรับ PDF
]);
