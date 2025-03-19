import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUserProfileController
} from '../controllers/user.controller';
import { userProfileUpload } from '../middlewares/uploads/user.upload';

const router = express.Router();

// สร้างผู้ใช้ใหม่
router.post('/users', createUserController);

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/users', getUsersController);

// ดึงข้อมูลผู้ใช้โดย ID
router.get('/user/:id', getUserByIdController);

router.get('/user/profile/:username', getUserProfileController);

// อัปเดตข้อมูลผู้ใช้
router.put('/user/:id', userProfileUpload, updateUserController);
// ลบผู้ใช้
router.delete('/user/:id', deleteUserController);

export default router;