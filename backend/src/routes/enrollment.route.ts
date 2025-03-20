import express from 'express';
import {
  createEnrollmentController,
  getEnrollmentsController,
  getEnrollmentByIdController,
  // updateEnrollmentController,
  getEnrollmentsByUserIdController
} from '../controllers/enrollment.controller';
import { licenseUpload } from '../middlewares/uploads/license.upload';
import verifyToken from '../middlewares/auth';

const router = express.Router();

// Create enrollment request
router.post(
  '/user/enrollment', 
  licenseUpload, 
  createEnrollmentController
);

// Get all enrollment requests (admin only)
router.get(
  '/enrollments', 
  getEnrollmentsController
);

// Get specific enrollment request
router.get(
  '/enrollment/:id', 
  getEnrollmentByIdController
);

// Update enrollment request (for approving/rejecting)
// router.put(
//   '/enrollment/:id', 
//   updateEnrollmentController
// );

// Get enrollment requests by user ID
router.get(
  '/user/:userId/enrollments', 
  getEnrollmentsByUserIdController
);

export default router;