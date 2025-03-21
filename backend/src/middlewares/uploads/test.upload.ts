// test.upload.ts
import createUploader from './base.upload';

// More specific MIME types for better validation
export const testUpload = createUploader([
    {
      subfolder: 'test',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      name: 'test',
      maxCount: 1,
    }
]); 

export const testMultiUpload = createUploader([
    {
      subfolder: 'test2',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      name: 'test2',
      maxCount: 1,
    },
    {
        subfolder: 'test3',
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        name: 'test3',
        maxCount: 1,
    }
]);