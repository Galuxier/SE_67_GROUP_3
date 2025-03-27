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

  async getUsersByRole(role: string): Promise<UserDocument[]> {
    try {
      return await User.find({ role: { $in: [role] } });
    } catch (error) {
      console.error(`Error getting users with role ${role}:`, error);
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<UserDocument | null> {
    try {
      // ตรวจสอบว่า userId เป็น ObjectId ที่ถูกต้อง
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
      }

      const user = await User.findById(userId).select('role'); // ดึงเฉพาะ field role

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error in getUserRoles:', error);
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

  async getTrainersInGym(gymId: string): Promise<UserDocument[]> {
    try {
      // Find all users with role 'trainer' who are associated with this gym
      return await User.find({
        role: { $in: ['trainer'] },
        gym_id: new Types.ObjectId(gymId)
      });
    } catch (error) {
      console.error('Error fetching trainers by gym ID:', error);
      throw error;
    }
  }
  
  async getTrainersNotInGym(gymId: string): Promise<UserDocument[]> {
    try {
      // Find all users with role 'trainer' who are either:
      // 1. Not associated with any gym ($exists: false), or
      // 2. Associated with a different gym ($ne: gymId)
      return await User.find({
        role: { $in: ['trainer'] },
        $or: [
          { gym_id: { $exists: false } },
          { gym_id: { $eq: null } },
          { gym_id: { $ne: new Types.ObjectId(gymId) } }
        ]
      });
    } catch (error) {
      console.error('Error fetching trainers not in gym:', error);
      throw error;
    }
  }
}

export default new UserService();
