import { Schema, model, Document } from 'mongoose';

// กำหนด enum สำหรับ status ใน courses
enum CourseStatus {
  Preparing = 'preparing',
  Ongoing = 'ongoing',
  Finished = 'finished',
  Cancel = 'cancel',
}

// กำหนด interface สำหรับ facilities
interface Facility {
  facility_name: string;
  facility_icon: string;
}

// กำหนด interface สำหรับ courses
interface Course {
  course_id: Schema.Types.ObjectId;
  status: CourseStatus;
}

// กำหนด interface สำหรับ address
interface Address {
  province: string;
  district: string;
  subdistrict: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  information?: string;
}

// กำหนด interface สำหรับ Gym document
export interface GymDocument extends Document {
  owner_id: Schema.Types.ObjectId;
  gym_name: string;
  gym_image_url: string[];
  contact?: { [key: string]: any };
  description: string;
  facilities: Facility[];
  courses: Course[];
  address: Address;
}

// สร้าง schema สำหรับ Gym
const GymSchema = new Schema<GymDocument>({
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  gym_name: { type: String, required: true }, 
  gym_image_url: { type: [String] },
  contact: { type: Schema.Types.Mixed },
  description: { type: String},
  facilities: [{
    facility_name: { type: String },
    facility_icon: { type: String },
  }],
  courses: [{
    course_id: { type: Schema.Types.ObjectId, ref: "course" },
    status: { type: String, enum: Object.values(CourseStatus) },
  }],
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    subdistrict: { type: String, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    information: { type: String },
  },
});

// สร้างโมเดล Gym


export const Gym = model<GymDocument>('Gym', GymSchema);