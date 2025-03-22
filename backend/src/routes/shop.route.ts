import express from 'express';
import{
    createShopController,
    getShopsController,
    getShopByIdController,
    updateShopController,
    deleteShopController,
    getUserShops
} from '../controllers/shop.controller';
// import { shopLicenseUpload, shopLogoUpload } from '../middlewares/uploads/shop.upload';
import createMultiFieldUploader from '../middlewares/uploads/shop.upload';

const router = express.Router();

const shopUpload = createMultiFieldUploader(
    [
      { name: 'logo', maxCount: 1 }, // ฟิลด์สำหรับโลโก้
      { name: 'license', maxCount: 1 }, // ฟิลด์สำหรับใบอนุญาต
    ],
    'shops', // โฟลเดอร์หลัก
    ['image/'] // อนุญาตเฉพาะไฟล์รูปภาพ
  );

router.post('/shops', shopUpload, createShopController);

router.get('/shops', getShopsController);

router.get('/shop/:id', getShopByIdController);

router.put('/shop/:id', updateShopController);

router.delete('/shop/:id', deleteShopController);

router.get('/shops/user/:id', getUserShops)

export default router;