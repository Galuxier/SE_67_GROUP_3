import { Enrollment, EnrollmentDocument } from '../models/enrollment.model';
import { BaseService } from './base.service';

class EnrollmentService extends BaseService<EnrollmentDocument> {
  constructor() {
    super(Enrollment);
  }

  // Get enrollments by user ID
  async getEnrollmentsByUserId(userId: string): Promise<EnrollmentDocument[]> {
    return await Enrollment.find({ user_id: userId });
  }

  // Additional methods can be added here as needed
}

export default new EnrollmentService();