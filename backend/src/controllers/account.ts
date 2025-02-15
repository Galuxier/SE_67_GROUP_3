import { Request, Response } from 'express';
import Account from '../models/account';

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมดจาก MongoDB
export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching accounts', error: err });
  }
};

// ฟังก์ชันสำหรับเพิ่มผู้ใช้ใหม่
export const createAccount = async (req: Request, res: Response): Promise<void> => {
  const { user_name, first_name, last_name, date_of_birth } = req.body;
  console.log(req.body);  // ตรวจสอบข้อมูลที่ส่งมาจาก client

  try {
    const newAccount = new Account({ user_name, 
                                     first_name, 
                                     last_name,
                                     date_of_birth });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(400).json({ message: 'Error creating account', error: err });
  }
};

export const updateAccount = async (req: Request, res: Response): Promise<void> => {
  const { user_name, first_name, last_name, date_of_birth } = req.body;
  const accountId = req.params.id; // สมมติว่า ID ของบัญชีผู้ใช้จะถูกส่งมาทาง URL

  try {
    // ค้นหาบัญชีผู้ใช้จาก ID
    const account = await Account.findById(accountId);

    // ตรวจสอบว่าพบข้อมูลบัญชีผู้ใช้หรือไม่
    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    // อัปเดตข้อมูลบัญชีผู้ใช้
    account.user_name = user_name || account.user_name;
    account.first_name = first_name || account.first_name;
    account.last_name = last_name || account.last_name;
    account.date_of_birth = date_of_birth || account.date_of_birth;

    // บันทึกการเปลี่ยนแปลง
    await account.save();

    // ส่งข้อมูลบัญชีที่อัปเดตแล้วกลับไป
    res.status(200).json(account);
  } catch (err) {
    // หากเกิดข้อผิดพลาด
    res.status(500).json({ message: 'Error updating account', error: err });
  }
};
