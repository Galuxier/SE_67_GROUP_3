import { Schema, model, Document } from 'mongoose';

export interface FightHistoryDocument extends Document {
  user_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  event_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Events
  weight_class_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Brackets
  match_id: Schema.Types.ObjectId[]; // อ้างอิงไปที่ Matches
}

const FightHistorySchema = new Schema<FightHistoryDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
  event_id: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // อ้างอิงไปที่ Events
  weight_class_id: { type: Schema.Types.ObjectId, required: true }, // อ้างอิงไปที่ Brackets
  match_id: [{ type: Schema.Types.ObjectId, required: true }], // อ้างอิงไปที่ Matches
});

export const FightHistory = model<FightHistoryDocument>('FightHistory', FightHistorySchema);