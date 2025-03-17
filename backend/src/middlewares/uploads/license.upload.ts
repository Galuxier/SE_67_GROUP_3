import createUploader from './base.upload';

export const licenseUpload = createUploader(
  5, // Maximum 5 files
  false, // Multiple files, not single
  'licenses', // Store in the 'licenses' subfolder
  ['image/', 'application/pdf'], // Allow images and PDFs
  'licenses' // Field name in form data
);