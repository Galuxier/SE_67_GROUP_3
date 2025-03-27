// src/services/ticket.service.ts
import { Ticket, TicketDocument } from '../models/ticket.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

interface CreateTicketData {
  user_id: Types.ObjectId;
  event_id: Types.ObjectId;
  seat_id: Types.ObjectId;
  ticket_date: Date;
  status: 'active' | 'used' | 'cancelled';
}

class TicketService extends BaseService<TicketDocument> {
  constructor() {
    super(Ticket);
  }

  /**
   * Create a new ticket for an event
   * @param ticketData Ticket creation data
   * @returns The created ticket
   */
  async createTicket(ticketData: CreateTicketData): Promise<TicketDocument> {
    try {
      const ticket = new Ticket({
        user_id: ticketData.user_id,
        event_id: ticketData.event_id,
        seat_id: ticketData.seat_id,
        ticket_date: ticketData.ticket_date || new Date(),
        status: ticketData.status || 'active',
      });

      return await ticket.save();
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  /**
   * Get all tickets for a specific user
   * @param userId The user ID
   * @returns Array of tickets belonging to the user
   */
  async getUserTickets(userId: string): Promise<TicketDocument[]> {
    return await Ticket.find({ user_id: new Types.ObjectId(userId) })
      .populate('event_id')
      .populate('seat_id');
  }

  /**
   * Get all tickets for a specific event
   * @param eventId The event ID
   * @returns Array of tickets for the event
   */
  async getEventTickets(eventId: string): Promise<TicketDocument[]> {
    return await Ticket.find({ event_id: new Types.ObjectId(eventId) })
      .populate('user_id', 'username first_name last_name')
      .populate('seat_id');
  }

  /**
   * Check if a specific seat is available for an event on a specific date
   * @param eventId The event ID
   * @param seatId The seat ID
   * @param date The date to check availability for
   * @returns True if the seat is available, false otherwise
   */
  async isSeatAvailable(eventId: string, seatId: string, date: Date): Promise<boolean> {
    const ticket = await Ticket.findOne({
      event_id: new Types.ObjectId(eventId),
      seat_id: new Types.ObjectId(seatId),
      ticket_date: date,
      status: { $ne: 'cancelled' }, // Not cancelled tickets
    });

    return !ticket; // If no ticket is found, the seat is available
  }

  /**
   * Get all available seats for an event on a specific date
   * @param eventId The event ID
   * @param date The date to check availability for
   * @returns Array of available seat IDs
   */
  async getAvailableSeats(eventId: string, date: Date): Promise<string[]> {
    // This implementation depends on your data model
    // You might need to get all seats from the event first
    // Then filter out the ones that are already booked
    
    // Example implementation
    const bookedTickets = await Ticket.find({
      event_id: new Types.ObjectId(eventId),
      ticket_date: date,
      status: { $ne: 'cancelled' },
    }).select('seat_id');

    const bookedSeatIds = bookedTickets.map(ticket => ticket.seat_id.toString());
    
    // Now you would need to get all seats from the event and filter out the booked ones
    // This is placeholder code - you'll need to implement based on your event model
    // const event = await Event.findById(eventId).populate('seat_zones.seats');
    // const allSeats = event.seat_zones.flatMap(zone => zone.seats);
    // const availableSeats = allSeats.filter(seat => !bookedSeatIds.includes(seat._id.toString()));

    // For now, just return the booked seat IDs (you'll need to modify this)
    return bookedSeatIds;
  }

  /**
   * Update ticket status
   * @param ticketId The ticket ID
   * @param status The new status
   * @returns The updated ticket
   */
  async updateTicketStatus(ticketId: string, status: 'active' | 'used' | 'cancelled'): Promise<TicketDocument | null> {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );
  }
}

export default new TicketService();