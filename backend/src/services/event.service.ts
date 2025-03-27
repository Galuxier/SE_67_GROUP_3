import { Event, EventDocument } from '../models/event.model';
import {BaseService} from './base.service';
import { Types } from 'mongoose';

class EventService extends BaseService<EventDocument> {
  constructor() {
    super(Event);
  }

  async getEventByOrganizerId(id: string): Promise<EventDocument[]> {
      return await Event.find({ organizer_id: new Types.ObjectId(id) });
  }

  async updateAvailableSeats(
    eventId: string,
    seatZoneId: string,
    date: Date,
    quantityChange: number
  ): Promise<EventDocument | null> {
    try {
      const event = await Event.findById(eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Find the correct seat zone
      const seatZone = event.seat_zones.find(
        zone => zone._id.toString() === seatZoneId
      );
      
      if (!seatZone) {
        throw new Error(`Seat zone ${seatZoneId} not found in event ${eventId}`);
      }
      
      // Update the available seats
      // This assumes your model has a number_of_seat or similar property
      // that tracks available seats
      if (seatZone.number_of_seat + quantityChange < 0) {
        throw new Error('Not enough seats available');
      }
      
      seatZone.number_of_seat += quantityChange;
      
      // Save the updated event
      await event.save();
      
      return event;
    } catch (error) {
      console.error('Error updating available seats:', error);
      throw error;
    }
  }

  async hasSufficientSeats(
    eventId: string,
    seatZoneId: string,
    quantity: number
  ): Promise<boolean> {
    const event = await Event.findById(eventId);
    
    if (!event) return false;
    
    const seatZone = event.seat_zones.find(
      zone => zone._id.toString() === seatZoneId
    );
    
    if (!seatZone) return false;
    
    return seatZone.number_of_seat >= quantity;
  }
}

export default new EventService;