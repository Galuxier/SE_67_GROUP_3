import { ObjectId } from 'mongoose';
import { User, UserDocument } from '../models/user.model';

// สร้างผู้ใช้ใหม่
export const createUser = async (userData: UserDocument) => {
  const newUser = await User.create(userData);
  // const newUser = new User(userData);
  // await newUser.save();
  // console.log(newUser);
  return newUser;
};

// ดึงข้อมูลผู้ใช้ทั้งหมด
export const getUsers = async () => {
  return await User.find();
};

// ดึงข้อมูลผู้ใช้โดย ID
export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};

// อัปเดตข้อมูลผู้ใช้
export const updateUser = async (userId: string, updateData: Partial<UserDocument>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, updateData);
  user.updated_at = new Date();
  await user.save();
  return user;
};

// ลบผู้ใช้
export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};