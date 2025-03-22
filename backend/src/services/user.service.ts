import { Types } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { BaseService } from './base.service';

class UserService extends BaseService<UserDocument> {
  constructor() {
    super(User);
  }

  // ✅ ดึงข้อมูลโปรไฟล์ผู้ใช้
  async getUserProfile(username: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  // ✅ เพิ่ม role ให้ user (ตรวจสอบว่า role ยังไม่มีอยู่ก่อน)
  async addUserRole(userId: Types.ObjectId, role: string): Promise<UserDocument | null> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!user.role.includes(role)) {
      user.role.push(role);
      await user.save();
    }

    return user;
  }

  // ✅ ลบ role ออกจาก user
  async removeUserRole(userId: string, role: string): Promise<UserDocument | null> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.role = user.role.filter((r) => r !== role);
    await user.save();

    return user;
  }

  // ✅ อัปเดต role ของ user (แทนที่ทั้ง array)
  async updateUserRoles(userId: string, roles: string[]): Promise<UserDocument | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: roles },
      { new: true }
    );

    if (!user) throw new Error('User not found');

    return user;
  }
}

export default new UserService();
