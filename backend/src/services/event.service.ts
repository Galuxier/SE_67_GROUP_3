import { Event, EventDocument } from '../models/event.model';
import {BaseService} from './base.service';
import { Types } from 'mongoose';
import { Place } from '../models/place.model'; // ปรับ path ตามโครงสร้างโปรเจค

class EventService extends BaseService<EventDocument> {
  constructor() {
    super(Event);
  }
  async searchEvents(
    query: string,
    province?: string,
    locationName?: string,
    minDate?: Date,
    maxDate?: Date,
    level?: string,
    page: number = 1,
    limit: number = 10,
    sort?: string
  ): Promise<{ events: EventDocument[], total: number }> {
    const filter: any = {};
  
    // Add search query condition
    if (query && query.trim().length > 0) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { event_name: searchRegex },
        { description: searchRegex }
      ];
    }
  
    // Add level filter
    if (level) {
      filter.level = level;
    }
  
    // Add date range filter
    if (minDate !== undefined || maxDate !== undefined) {
      filter.start_date = {};
      if (minDate !== undefined) filter.start_date.$gte = minDate;
      if (maxDate !== undefined) filter.end_date.$lte = maxDate;
    }
  
    // Define sort options
    let sortOption: any = { start_date: 1 };
    if (sort === 'price-low-to-high') {
      sortOption = { 'seat_zones.price': 1 };
    } else if (sort === 'price-high-to-low') {
      sortOption = { 'seat_zones.price': -1 };
    } else if (sort === 'newest') {
      sortOption = { start_date: -1 };
    }
  
    // Execute query with population
    const eventsQuery = Event.find(filter)
      .populate({
        path: 'location_id',
        match: {
          ...(province && { 'address.province': new RegExp(province, 'i') }),
          ...(locationName && { name: new RegExp(locationName, 'i') })
        },
        select: 'name address'
      })
      .sort(sortOption)
      .lean();
  
    // Get all matching events first
    const allEvents = await eventsQuery.exec();
    const filteredEvents = allEvents.filter(event => event.location_id !== null);
  
    // Calculate pagination
    const skip = (page - 1) * limit;
    const paginatedEvents = filteredEvents.slice(skip, skip + limit);
    const total = filteredEvents.length;
  
    return { events: paginatedEvents, total };
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