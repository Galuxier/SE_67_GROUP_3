import createUploader from './base.upload';

// For product main images
export const productImageUpload = createUploader([
  {
    subfolder: 'shops/products',
    allowedMimeTypes: ['image/'],
    name: 'product_image_urls',
    maxCount: 10, // Allow up to 10 product images
  }
]);

// For variant images
export const variantImageUpload = createUploader([
  {
    subfolder: 'shops/variants',
    allowedMimeTypes: ['image/'],
    name: 'variant_image_url',
    maxCount: 1, // Only one image per variant
  }
]);

// For batch uploading variant images (useful when creating a product with multiple variants)
export const batchVariantImageUpload = (req: any, res: any, next: any) => {
  // First, read the form data to get the number of variants
  const multer = require('multer');
  const parseForm = multer().none();
  
  parseForm(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }
    
    // Get the number of variants from the request
    const variantCount = parseInt(req.body.variantCount || '0', 10);
    
    // Create upload field configurations for product and variants
    const uploadFields = [
      {
        subfolder: 'products',
        allowedMimeTypes: ['image/'],
        name: 'product_image_urls',
        maxCount: 10,
      }
    ];
    
    // Add variant image upload fields based on the count
    for (let i = 0; i < variantCount; i++) {
      uploadFields.push({
        subfolder: 'products/variants',
        allowedMimeTypes: ['image/'],
        name: `variants[${i}][variant_image_url]`,
        maxCount: 1,
      });
    }
    
    // Create the dynamic uploader with the fields we just defined
    const dynamicUploader = createUploader(uploadFields);
    
    // Use the dynamic uploader as middleware
    dynamicUploader(req, res, next);
  });
};