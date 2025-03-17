import { Schema, model, Document, Types } from 'mongoose';

// Export the enum so it can be used in other files
export enum EnrollmentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

export interface EnrollmentDocument extends Document {
  user_id: Types.ObjectId; // เปลี่ยนจาก Schema.Types.ObjectId เป็น Types.ObjectId
  role: string;
  description: string;
  license_files: string[]; // Paths to uploaded license files
  status: EnrollmentStatus;
  create_at: Date;
  updated_at?: Date;
  reviewer_id?: Types.ObjectId; // เปลี่ยนจาก Schema.Types.ObjectId เป็น Types.ObjectId
}

const EnrollmentSchema = new Schema<EnrollmentDocument>({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ['Gym Owner', 'Organizer', 'Shop Owner', 'Trainer', 'Boxer', 'Lessor']
  },
  description: { 
    type: String, 
    required: true 
  },
  license_files: { 
    type: [String], 
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(EnrollmentStatus), 
    default: EnrollmentStatus.Pending 
  },
  create_at: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  updated_at: { 
    type: Date 
  },
  reviewer_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

export const Enrollment = model<EnrollmentDocument>('Enrollment', EnrollmentSchema);
