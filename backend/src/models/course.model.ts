import { Schema, model, Document } from 'mongoose';

// กำหนด enum สำหรับ status ใน course
enum CourseStatus {
  Preparing = 'preparing',
  Ongoing = 'ongoing',
  Finished = 'finished',
  Cancel = 'cancel',
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
  time: string;
  trainer: Schema.Types.ObjectId[];
}

// กำหนด interface สำหรับ packages
interface Package {
  order_id: Schema.Types.ObjectId;
  package_id: Schema.Types.ObjectId;
  used_at: Date;
  status: PackageStatus;
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
  image_url: string[];
  status: CourseStatus;
  activities: Activity[];
  packages: Package[];
}

// สร้าง schema สำหรับ Course
const CourseSchema = new Schema<CourseDocument>({
  gym_id: { type: Schema.Types.ObjectId, ref: "Gym", required: true },
  course_name: { type: String, required: true },
  level: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image_url: { type: [String], required: true },
  status: { type: String, enum: Object.values(CourseStatus), required: true },
  activities: [{
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    trainer: { type: [Schema.Types.ObjectId], required: true },
  }],
  packages: [{
    order_id: { type: Schema.Types.ObjectId, required: true },
    package_id: { type: Schema.Types.ObjectId, required: true },
    used_at: { type: Date, required: true },
    status: { type: String, enum: Object.values(PackageStatus), required: true },
  }],
});

// สร้างโมเดล Course


export const Course = model<CourseDocument>('Course', CourseSchema);