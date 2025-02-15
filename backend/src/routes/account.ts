import { Router } from 'express';
import { getAccounts, createAccount, updateAccount } from '../controllers/account';

const router = Router();

// Route สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', getAccounts);

// Route สำหรับเพิ่มผู้ใช้ใหม่
router.post('/', createAccount);

router.put('/:id', updateAccount);

export default router;
