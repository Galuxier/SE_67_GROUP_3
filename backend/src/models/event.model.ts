import { Schema, model, Document } from 'mongoose';

// กำหนด enum สำหรับ status ใน event
enum EventStatus {
  Preparing = 'preparing',
  Ongoing = 'ongoing',
  Finished = 'finished',
  Cancel = 'cancel',
}

// กำหนด enum สำหรับ result ใน qualifier และ matches
enum MatchResult {
  Boxer1Win = 'boxer1_win',
  Boxer2Win = 'boxer2_win',
}

// กำหนด interface สำหรับ weight_classes
interface WeightClass {
  type: string; // สามารถปรับเป็น enum ได้หากมีค่าที่แน่นอน
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
  seat_zone_id: Schema.Types.ObjectId;
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
  start_date: Date;
  end_date: Date;
  weight_classes: WeightClass[];
  brackets: string[];
  applicants: string[];
  seat_zones: SeatZone[];
  status: EventStatus;
  packages: Package[];
}

// สร้าง schema สำหรับ Event
const EventSchema = new Schema<EventDocument>({
  organizer_id: { type: Schema.Types.ObjectId, required: true },
  location_id: { type: Schema.Types.ObjectId, required: true },
  event_name: { type: String, required: true },
  level: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  weight_classes: [{
    type: { type: String, required: true },
    weigh_name: { type: String, required: true },
    min_weight: { type: Number, required: true },
    max_weight: { type: Number, required: true },
    max_enrollment: { type: Number, required: true },
    matches: [{
      match_id: { type: Schema.Types.ObjectId, required: true },
      boxer1_id: { type: Schema.Types.ObjectId, required: true },
      boxer2_id: { type: Schema.Types.ObjectId, required: true },
      match_date: { type: Date, required: true },
      match_time: { type: Date, required: true },
      result: { type: String, enum: Object.values(MatchResult), required: true },
      previous_match: { type: Schema.Types.ObjectId },
      next_match: { type: Schema.Types.ObjectId },
    }],
    applicants: [{
      applicant_id: { type: Schema.Types.ObjectId, required: true },
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      weight: { type: Number, required: true },
      applicate_at: { type: Date, required: true },
    }],
    qualifiers: [{
      qualifier_id: { type: Schema.Types.ObjectId, required: true },
      boxer1_id: { type: Schema.Types.ObjectId, required: true },
      boxer2_id: { type: Schema.Types.ObjectId, required: true },
      qualifier_date: { type: Date, required: true },
      qualifier_time: { type: Date, required: true },
      result: { type: String, enum: Object.values(MatchResult), required: true },
      previous_qualifier: { type: Schema.Types.ObjectId },
      next_qualifier: { type: Schema.Types.ObjectId },
    }],
  }],
  brackets: { type: [String], required: true },
  applicants: { type: [String], required: true },
  seat_zones: [{
    seat_zone_id: { type: Schema.Types.ObjectId, required: true },
    zone_name: { type: String, required: true },
    price: { type: Number, required: true },
    seats: [{
      seat_id: { type: Schema.Types.ObjectId, required: true },
      seat_number: { type: String, required: true },
    }],
    number_of_seat: { type: Number, required: true },
  }],
  status: { type: String, enum: Object.values(EventStatus), required: true },
  packages: [{
    order_id: { type: Schema.Types.ObjectId, required: true },
    package_id: { type: Schema.Types.ObjectId, required: true },
    used_at: { type: Date, required: true },
    status: { type: String, enum: Object.values(EventStatus), required: true },
  }],
});

// สร้างโมเดล Event


export const Event = model<EventDocument>('Event', EventSchema);