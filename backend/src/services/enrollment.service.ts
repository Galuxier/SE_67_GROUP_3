import { Enrollment, EnrollmentDocument } from '../models/enrollment.model';
import { BaseService } from './base.service';
import UserService from './user.service'; // เพิ่ม import เข้ามา
import { Types } from 'mongoose';

class EnrollmentService extends BaseService<EnrollmentDocument> {
  constructor() {
    super(Enrollment);
  }

  async getAllEnrollment() {
    return await Enrollment.find()
      .populate('user_id', 'username first_name last_name email profile_picture_url')
      .populate('reviewer_id')
      .exec();
  }

  async getEnrollmentsByUserId(userId: string): Promise<EnrollmentDocument[]> {
    return await Enrollment.find({ user_id: userId });
  }

  // ✅ เพิ่ม method สำหรับอัปเดต Enrollment และ Role ของ User
  async updateEnrollment(id: string, data: any): Promise<EnrollmentDocument | null> {
    console.log(data);
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { 
        ...data,
        updated_at: new Date(),
        reviewer_id: data.reviewer_id,
      },
      { new: true }
    )
    .populate('user_id', 'username first_name last_name email profile_picture_url')  // เพิ่ม populate user_id
    .populate('reviewer_id')  // เพิ่ม populate reviewer_id
    .exec();
    
    // ถ้าอัปเดตสถานะเป็น approved → ให้ไปอัปเดต role ด้วย
    if (updatedEnrollment && data.status === 'approved') {
      await UserService.addUserRole(updatedEnrollment.user_id, updatedEnrollment.role);
    }
    console.log(updatedEnrollment);
    
    return updatedEnrollment;
  }
}

export default new EnrollmentService();
