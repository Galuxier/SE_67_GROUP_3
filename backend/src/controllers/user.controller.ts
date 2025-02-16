import { Request, Response } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../services/user.service';

// สร้างผู้ใช้ใหม่
export const createUserController = async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
};

// ดึงข้อมูลผู้ใช้ทั้งหมด
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// ดึงข้อมูลผู้ใช้จาก _id
export const getUserByIdController = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserById(req.params.id);
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
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
};

// ลบผู้ใช้
export const deleteUserController = async (req: Request, res: Response) => {
  try { 
    const deletedUser = await deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err});
  }
};