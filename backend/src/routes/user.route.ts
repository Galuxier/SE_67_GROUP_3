import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.controller';

const router = express.Router();

// สร้างผู้ใช้ใหม่
router.post('/users', createUserController);

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/users', getUsersController);

// ดึงข้อมูลผู้ใช้โดย ID
router.get('/users/:id', getUserByIdController);

// อัปเดตข้อมูลผู้ใช้
router.put('/users/:id', updateUserController);

// ลบผู้ใช้
router.delete('/users/:id', deleteUserController);

export default router;