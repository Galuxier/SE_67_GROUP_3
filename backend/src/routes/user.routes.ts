import express from 'express';
import {
  createTempUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUserProfileController,
  getUserRolesController,
} from '../controllers/user.controller';
import { userProfileUpload } from '../middlewares/uploads/user.upload';
import verifyToken from '../middlewares/auth';

const router = express.Router();

// สร้างผู้ใช้ใหม่
router.post('/users', userProfileUpload, createTempUserController);

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/users', getUsersController);

router.get('/user/:id/roles', verifyToken, getUserRolesController);

// ดึงข้อมูลผู้ใช้โดย ID
router.get('/user/:id', getUserByIdController);

router.get('/user/profile/:username', getUserProfileController);

// อัปเดตข้อมูลผู้ใช้
router.put('/user/:id', userProfileUpload, updateUserController);
// ลบผู้ใช้
router.delete('/user/:id', deleteUserController);

export default router;