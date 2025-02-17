import express from 'express';
import {
  createAdsPackageController,
  getAdsPackagesController,
  getAdsPackageByIdController,
  updateAdsPackageController,
  deleteAdsPackageController,
} from '../controllers/adsPackage.controller';

const router = express.Router();

// สร้าง Package ใหม่
router.post('/adsPackages', createAdsPackageController);

// ดึงข้อมูล Package ทั้งหมด
router.get('/adsPackages', getAdsPackagesController);

// ดึงข้อมูล Package โดย ID
router.get('/adsPackage/:id', getAdsPackageByIdController);

// อัปเดตข้อมูล Package
router.put('/adsPackage/:id', updateAdsPackageController);

// ลบ Package
router.delete('/adsPackage/:id', deleteAdsPackageController);

export default router;