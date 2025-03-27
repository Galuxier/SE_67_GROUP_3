// src/routes/ownPackage.routes.ts
import express from 'express';
import {
  createOwnPackagesFromOrderController,
  getUserPackagesController,
  usePackageController,
  processExpiredPackagesController
} from '../controllers/ownPackage.controller';
import verifyToken from '../middlewares/auth';

const router = express.Router();

// Create own packages from a paid order (should be called when order status becomes paid)
router.post('/order/:orderId/packages', verifyToken, createOwnPackagesFromOrderController);

// Get user's active packages
router.get('/user/:userId/packages', verifyToken, getUserPackagesController);

// Mark a package as used
router.post('/packages/:packageId/use', verifyToken, usePackageController);

// Process expired packages (to be called by scheduler/cron job)
router.post('/packages/process-expired', verifyToken, processExpiredPackagesController);

export default router;