import { Schema, model, Document } from 'mongoose';

// กำหนด enum สำหรับ status ใน courses
enum CourseStatus {
  Starting = 'starting',
  Ongoing = 'ongoing',
  Finish = 'finish',
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
  information?: string; // optional field
}

// กำหนด interface สำหรับ Gym document
interface GymDocument extends Document {
  owner_id: Schema.Types.ObjectId;
  gym_image_url: string[];
  facilities: Facility[];
  courses: Course[];
  address: Address;
}

// สร้าง schema สำหรับ Gym
const GymSchema = new Schema<GymDocument>({
  owner_id: { type: Schema.Types.ObjectId, required: true },
  gym_image_url: { type: [String], required: true },
  facilities: [{
    facility_name: { type: String, required: true },
    facility_icon: { type: String, required: true },
  }],
  courses: [{
    course_id: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: Object.values(CourseStatus), required: true },
  }],
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    subdistrict: { type: String, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    information: { type: String },
  },
});

// สร้างโมเดล Gym
const GymModel = model<GymDocument>('Gym', GymSchema);

export default GymModel;