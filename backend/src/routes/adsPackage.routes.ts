import express from 'express';
import {
  createAdsPackageController,
  getAdsPackagesController,
  getAdsPackageByIdController,
  updateAdsPackageController,
  deleteAdsPackageController,
  getAdsPackagesByTypeController,
  getActiveAdsPackagesController
} from '../controllers/adsPackage.controller';
import multerMiddleware from '../middlewares/multerMiddleware';

const router = express.Router();

// สร้าง Package ใหม่
router.post('/adsPackages', multerMiddleware, createAdsPackageController);

// ดึงข้อมูล Package ทั้งหมด
router.get('/adsPackages', getAdsPackagesController);

// ดึงข้อมูล Package ที่ active อยู่
router.get('/adsPackages/active', getActiveAdsPackagesController);

// ดึงข้อมูล Package ตามประเภท (course, event)
router.get('/adsPackages/type/:type', getAdsPackagesByTypeController);

// ดึงข้อมูล Package โดย ID
router.get('/adsPackage/:id', getAdsPackageByIdController);

// อัปเดตข้อมูล Package
router.put('/adsPackage/:id', multerMiddleware, updateAdsPackageController);

// ลบ Package
router.delete('/adsPackage/:id', deleteAdsPackageController);

export default router;