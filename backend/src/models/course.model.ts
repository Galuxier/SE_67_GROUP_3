import { Schema, model, Document } from 'mongoose';

// กำหนด enum สำหรับ status ใน course
enum CourseStatus {
  Preparing = 'preparing',
  Ongoing = 'ongoing',
  Finished = 'finished',
  Cancel = 'cancel',
}

enum Level {
  ForKid = 'for_kid',
  Beginner = 'beginner',
  Advance = 'advance',
}

// กำหนด enum สำหรับ status ใน packages
enum PackageStatus {
  Active = 'active',
  Inactive = 'inactive',
  Used = 'used',
}

// กำหนด interface สำหรับ activities
interface Activity {
  description: string;
  date: Date;
  start_time: string;
  end_time: string;
  trainer: Schema.Types.ObjectId[];
}

// กำหนด interface สำหรับ packages
interface Package {
  order_id: Schema.Types.ObjectId;
  package_id: Schema.Types.ObjectId;
  used_at: Date;
  status: PackageStatus;
}

enum TrainerStatus {
  Pending = 'pending',
  Ready = 'ready',
  Reject = 'reject',
}

interface Trainer {
  traier_id: Schema.Types.ObjectId;
  status: TrainerStatus;
}

// กำหนด interface สำหรับ Course document
export interface CourseDocument extends Document {
  gym_id: Schema.Types.ObjectId;
  course_name: string;
  level: string;
  start_date: Date;
  end_date: Date;
  price: number;
  description?: string;
  course_image_url: string[];
  available_slot: number;
  status: CourseStatus;
  activities: Activity[];
  packages: Package[];
}

// สร้าง schema สำหรับ Course
const CourseSchema = new Schema<CourseDocument>({
  gym_id: { type: Schema.Types.ObjectId, ref: "Gym", required: true },
  course_name: { type: String, required: true },
  level: { type: String, enum: Object.values(Level), required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  course_image_url: { type: [String], required: true },
  available_slot: { type: Number, required: true },
  status: { type: String, enum: Object.values(CourseStatus), required: true, default: CourseStatus.Preparing },
  activities: [{
    description: { type: String, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    trainer_list: [{
      trainer_id: { type: Schema.Types.ObjectId, required: true},
      status: { type : String, enum: TrainerStatus, required: true }
    }],
  }],
  packages: [{
    order_id: { type: Schema.Types.ObjectId, required: true },
    package_id: { type: Schema.Types.ObjectId, ref: "AdsPackage", required: true },
    used_at: { type: Date, required: true },
    status: { type: String, enum: Object.values(PackageStatus), required: true },
  }],
});

// สร้างโมเดล Course


export const Course = model<CourseDocument>('Course', CourseSchema);