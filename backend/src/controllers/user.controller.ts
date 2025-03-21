import { Request, Response } from 'express';
import  UserService from '../services/user.service';

// สร้างผู้ใช้ใหม่
export const createUserController = async (req: Request, res: Response) => {
  try {
    const newUser = await UserService.add(req.body);
    res.status(201).json(newUser);
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
    console.log(req.body);
    
    const userData = { ...req.body };
    
    // Process the profile picture if it exists
    if (req.files && 'profile_picture' in req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.profile_picture && files.profile_picture.length > 0) {
        // Store the file path in the database
        userData.profile_picture_url = files.profile_picture[0].path.replace(/^.*?uploads\//, '');
      }
    }
    
    // Process contact info if it's a string (from FormData)
    if (typeof userData.contact_info === 'string') {
      try {
        userData.contact_info = JSON.parse(userData.contact_info);
      } catch (e) {
        console.error('Error parsing contact_info:', e);
      }
    }
    
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
