import { Schema, model, Document } from 'mongoose';

enum TicketStatus {
  Active = 'active',
  Used = 'used',
  Cancelled = 'cancelled',
}

interface TicketDocument extends Document {
  user_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  event_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Events
  seat_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Seats
  ticket_date: Date;
  status: TicketStatus;
}

const TicketSchema = new Schema<TicketDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
  event_id: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // อ้างอิงไปที่ Events
  seat_id: { type: Schema.Types.ObjectId, required: true }, // อ้างอิงไปที่ Seats
  ticket_date: { type: Date, required: true },
  status: { type: String, enum: Object.values(TicketStatus), required: true },
});

const TicketModel = model<TicketDocument>('Ticket', TicketSchema);

export default TicketModel;