import { Schema, model, Document } from 'mongoose';

enum TeachHistoryStatus {
  Preparing = 'preparing',
  Ongoing = 'ongoing',
  Completed = 'completed',
}

interface TeachHistoryDocument extends Document {
  trainer_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  course_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Course
  status: TeachHistoryStatus;
}

const TeachHistorySchema = new Schema<TeachHistoryDocument>({
  trainer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // อ้างอิงไปที่ Course
  status: { type: String, enum: Object.values(TeachHistoryStatus), required: true },
});

const TeachHistoryModel = model<TeachHistoryDocument>('TeachHistory', TeachHistorySchema);

export default TeachHistoryModel;