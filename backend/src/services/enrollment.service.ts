import { Enrollment, EnrollmentDocument, RoleType, EnrollmentStatus } from '../models/enrollment.model';
import { Notification, NotificationType } from '../models/notification.model';
import { BaseService } from './base.service';
import UserService from './user.service';

const ROLE_DISPLAY: Record<RoleType, string> = {
  boxer: "นักมวย",
  trainer: "โค้ชมวย",
  gym_owner: "เจ้าของค่ายมวย",
  organizer: "ผู้จัดการแข่งขัน",
  shop_owner: "เจ้าของร้านค้า",
  lessor: "ผู้ให้เช่าสถานที่",
};

interface UpdateEnrollmentData {
  status: EnrollmentStatus;
  reviewer_id: string;
  reject_reason?: string;
}

class EnrollmentService extends BaseService<EnrollmentDocument> {
  constructor() {
    super(Enrollment);
  }

  async getAllEnrollment(): Promise<EnrollmentDocument[]> {
    return await Enrollment.find()
      .populate('user_id', 'username first_name last_name email profile_picture_url')
      .populate('reviewer_id')
      .exec();
  }

  async getEnrollmentsByUserId(userId: string): Promise<EnrollmentDocument[]> {
    return await Enrollment.find({ user_id: userId });
  }

  async updateEnrollment(id: string, data: UpdateEnrollmentData): Promise<EnrollmentDocument | null> {
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { 
        ...data,
        updated_at: new Date(),
        reviewer_id: data.reviewer_id,
      },
      { new: true }
    )
    .populate('user_id', 'username first_name last_name email profile_picture_url')
    .populate('reviewer_id')
    .exec();

    if (!updatedEnrollment) return null;

    if (data.status === EnrollmentStatus.Approved) {
      await UserService.addUserRole(updatedEnrollment.user_id, updatedEnrollment.role);
      await Notification.create({
        user_id: updatedEnrollment.user_id._id,
        type: NotificationType.Enrollment,
        title: 'คำขอของคุณได้รับการอนุมัติ',
        message: `คำขอสำหรับบทบาท "${ROLE_DISPLAY[updatedEnrollment.role]}" ได้รับการอนุมัติแล้ว`,
        relate_id: updatedEnrollment._id,
        is_read: false,
        create_at: new Date(),
        // action_url: `/enrollment/${updatedEnrollment._id}`,
      });
    } else if (data.status === EnrollmentStatus.Rejected) {
      await Notification.create({
        user_id: updatedEnrollment.user_id._id,
        type: NotificationType.Enrollment,
        title: 'คำขอของคุณถูกปฏิเสธ',
        message: `คำขอสำหรับบทบาท "${ROLE_DISPLAY[updatedEnrollment.role]}" ถูกปฏิเสธ: ${data.reject_reason || 'ไม่ระบุเหตุผล'}`,
        relate_id: updatedEnrollment._id,
        is_read: false,
        create_at: new Date(),
        // action_url: `/enrollment/${updatedEnrollment._id}`,
      });
    }

    return updatedEnrollment;
  }
}

export default new EnrollmentService();