import createUploader from './base.upload';

// สร้าง middleware สำหรับอัปโหลดรูปภาพของ gym
// export const gymImagesUpload = createUploader(
//   10, // จำนวนไฟล์สูงสุดที่อนุญาต
//   false, // ไม่ใช่ single file upload
//   'gyms', // subfolder สำหรับเก็บรูปภาพ
//   ['image/'], // อนุญาตเฉพาะไฟล์รูปภาพ
//   'gym_images' // field name ที่ใช้ใน form-data
// );