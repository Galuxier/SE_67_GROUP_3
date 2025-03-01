import { Schema, model, Document } from 'mongoose';

enum RecommendType {
  Event = 'event',
  Course = 'course',
}

export interface RecommendDocument extends Document {
  type: RecommendType;
  relate_id: Schema.Types.ObjectId;
  relateModel: string; // ฟิลด์นี้จะเป็นค่า refPath
  start_date: Date;
  end_date: Date;
}

const RecommendSchema = new Schema<RecommendDocument>({
  type: { type: String, enum: Object.values(RecommendType), required: true },
  relateModel: { 
    type: String, 
    required: true, 
    enum: ['Event', 'Course'] // ใส่ชื่อ collection ที่รองรับ
  },
  relate_id: { type: Schema.Types.ObjectId, refPath: 'relateModel', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
});

export const Recommend = model<RecommendDocument>('Recommend', RecommendSchema);
