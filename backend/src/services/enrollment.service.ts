import { Enrollment, EnrollmentDocument } from '../models/enrollment.model';
import { BaseService } from './base.service';

class EnrollmentService extends BaseService<EnrollmentDocument> {
  constructor() {
    super(Enrollment);
  }


  async getAllEnrollment() {
    // const enrollment = await Enrollment.find()
    //   .populate('user_id', 'username first_name last_name')
    //   .populate('reviewer_id')
    //   .exec();

    // const result = enrollment.map(e => {
    //   return {
    //     ...e.toObject(),
    //     user: e.user_id, // เปลี่ยนชื่อ field จาก user_id เป็น user
    //     user_id: undefined
    //   };
    // });

    // return result;
    return await Enrollment.find()
    .populate('user_id', 'username first_name last_name')
    .populate('reviewer_id')
    .exec();
  }


  // Get enrollments by user ID
  async getEnrollmentsByUserId(userId: string): Promise<EnrollmentDocument[]> {
    return await Enrollment.find({ user_id: userId });
  }

  // Additional methods can be added here as needed
}

export default new EnrollmentService();