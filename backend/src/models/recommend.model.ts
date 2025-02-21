import { Schema, model, Document } from 'mongoose';

enum RecommendType {
  Event = 'event',
  Product = 'product',
  Course = 'course',
}

export interface RecommendDocument extends Document {
  type: RecommendType;
  relate_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Events, Products, หรือ Courses
  start_date: Date;
  end_date: Date;
}

const RecommendSchema = new Schema<RecommendDocument>({
  type: { type: String, enum: Object.values(RecommendType), required: true },
  relate_id: { type: Schema.Types.ObjectId, refPath: 'recommend.relateModel', required: true }, // อ้างอิงไปที่ Events, Products, หรือ Courses
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
});



export const Recommend = model<RecommendDocument>('Recommend', RecommendSchema);