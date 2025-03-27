import { Schema, model, Document } from 'mongoose';

// กำหนด enum สำหรับ status ใน event
enum EventStatus {
  Preparing = 'preparing',
  Ongoing = 'ongoing',
  Finished = 'finished',
  Cancel = 'cancel',
}

enum EventType {
  Registration = 'registration',
  TicketSales = 'ticket_sales',
}

enum PackageStatus {
  Active = 'active',
  Inactive = 'inactive',
  Used = 'used',
}

// กำหนด enum สำหรับ result ใน qualifier และ matches
enum MatchResult {
  Boxer1Win = 'boxer1_win',
  Boxer2Win = 'boxer2_win',
  Draw = 'draw'
}

enum Level {
  Beginner = 'beginner',
  Fighter = 'fighter'
}

enum Gender {
  Male = 'male',
  Female = 'female'
}

enum MatchType {
  Amateur = 'amateur',
  Professional = 'professional'
}

// กำหนด interface สำหรับ weight_classes
interface WeightClass {
  type: MatchType; // สามารถปรับเป็น enum ได้หากมีค่าที่แน่นอน
  gender: Gender;
  weigh_name: string;
  min_weight: number;
  max_weight: number;
  max_enrollment: number;
  matches: Match[];
  applicants: Applicant[];
  qualifiers: Qualifier[];
}

// กำหนด interface สำหรับ matches
interface Match {
  match_id: Schema.Types.ObjectId;
  boxer1_id: Schema.Types.ObjectId;
  boxer2_id: Schema.Types.ObjectId;
  match_date: Date;
  match_time: Date;
  result: MatchResult;
  previous_match?: Schema.Types.ObjectId;
  next_match?: Schema.Types.ObjectId;
}

// กำหนด interface สำหรับ applicants
interface Applicant {
  applicant_id: Schema.Types.ObjectId;
  first_name: string;
  last_name: string;
  weight: number;
  applicate_at: Date;
}

// กำหนด interface สำหรับ qualifiers
interface Qualifier {
  qualifier_id: Schema.Types.ObjectId;
  boxer1_id: Schema.Types.ObjectId;
  boxer2_id: Schema.Types.ObjectId;
  qualifier_date: Date;
  qualifier_time: Date;
  result: MatchResult;
  previous_qualifier?: Schema.Types.ObjectId;
  next_qualifier?: Schema.Types.ObjectId;
}

// กำหนด interface สำหรับ seat_zones
interface SeatZone {
  _id: Schema.Types.ObjectId;
  zone_name: string;
  price: number;
  seats: Seat[];
  number_of_seat: number;
  
}

// กำหนด interface สำหรับ seats
interface Seat {
  seat_id: Schema.Types.ObjectId;
  seat_number: string;
}

// กำหนด interface สำหรับ packages
interface Package {
  order_id: Schema.Types.ObjectId;
  package_id: Schema.Types.ObjectId;
  used_at: Date;
  status: EventStatus;
}

// กำหนด interface สำหรับ Event document
export interface EventDocument extends Document {
  organizer_id: Schema.Types.ObjectId;
  location_id: Schema.Types.ObjectId;
  event_name: string;
  level: string;
  description: string;
  poster_url: string;
  start_date: Date;
  end_date: Date;
  weight_classes: WeightClass[];
  seat_zones: SeatZone[];
  seatZone_url: string;
  status: EventStatus;
  packages: Package[];
  event_type: EventType;
} 

// สร้าง schema สำหรับ Event
const EventSchema = new Schema<EventDocument>({
  organizer_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // ref ถึง User
  location_id: { type: Schema.Types.ObjectId, required: true, ref: 'Place' }, // เพิ่ม ref: 'Place'
  event_name: { type: String, required: true },
  description: { type: String, required: false },
  level: { type: String, enum: Object.values(Level), required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  poster_url: { type: String, required: true },
  event_type: { type: String, enum: Object.values(EventType), required: true },
  weight_classes: [{
    type: { type: String, enum: Object.values(MatchType), required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    weigh_name: { type: String, required: true },
    min_weight: { type: Number, required: true },
    max_weight: { type: Number, required: true },
    max_enrollment: { type: Number, required: true },
    matches: [{
      boxer1_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      boxer2_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      match_date: { type: Date, required: true },
      match_time: { type: Date, required: true },
      result: { type: String, enum: Object.values(MatchResult) },
      previous_match: { type: Schema.Types.ObjectId },
      next_match: { type: Schema.Types.ObjectId },
    }],
    applicants: [{
      applicant_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      weight: { type: Number, required: true },
      applicate_at: { type: Date, required: true },
    }],
    qualifiers: [{
      boxer1_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      boxer2_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      qualifier_date: { type: Date, required: true },
      qualifier_time: { type: Date, required: true },
      result: { type: String, enum: Object.values(MatchResult), required: true },
      previous_qualifier: { type: Schema.Types.ObjectId },
      next_qualifier: { type: Schema.Types.ObjectId },
    }],
  }],
  seat_zones: [{
    zone_name: { type: String, required: true },
    price: { type: Number, required: true },
    seats: [{
      seat_number: { type: String, required: true },
    }],
    number_of_seat: { type: Number, required: true },
  }],
  seatZone_url: { type: String },
  status: { type: String, enum: Object.values(EventStatus), required: true },
  packages: [{
    order_id: { type: Schema.Types.ObjectId, required: true },
    package_id: { type: Schema.Types.ObjectId, required: true },
    used_at: { type: Date, required: true },
    status: { type: String, enum: Object.values(PackageStatus), required: true },
  }],
});



export const Event = model<EventDocument>('Event', EventSchema);