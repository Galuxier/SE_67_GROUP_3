import { Request, Response } from 'express';
import  UserService from '../services/user.service';

// สร้างผู้ใช้ใหม่
export const createTempUserController = async (req: Request, res: Response) => {
  try {
    const newUser = await UserService.add(req.body);
    res.status(201).json({
      success: true,
      message: 'Temp User Created',
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
};

// ดึงข้อมูลผู้ใช้ทั้งหมด
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

export const getUserProfileController = async (req: Request, res: Response) => {
  try{
    const user = await UserService.getUserProfile(req.params.username);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  }catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }

}

// ดึงข้อมูลผู้ใช้จาก _id
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
};

// อัปเดตข้อมูลผู้ใช้
export const updateUserController = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    
    // ข้อมูลที่ต้องการอัพเดทรวมถึง profile_picture_url ที่ได้จาก middleware
    const userData = { ...req.body };
    
    // แปลง contact_info จาก string เป็น object ถ้าจำเป็น
    if (typeof userData.contact_info === 'string') {
      try {
        userData.contact_info = JSON.parse(userData.contact_info);
      } catch (e) {
        console.error('Error parsing contact_info:', e);
      }
    }
    
    console.log('User data to update:', userData);
    
    const updatedUser = await UserService.update(req.params.id, userData);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user', error: err });
  }
};

// ลบผู้ใช้
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const deletedUser = await UserService.delete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};
