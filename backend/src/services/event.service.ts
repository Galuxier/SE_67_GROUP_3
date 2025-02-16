import { Event, EventDocument } from '../models/event.model';

export const createEvent = async (eventData: EventDocument) => {
  return await Event.create(eventData);
};

export const getEvents = async () => {
  return await Event.find().populate('organizer');
};

export const getEventById = async (eventId: string) => {
  return await Event.findById(eventId).populate('organizer');
};

export const updateEvent = async (eventId: string, updateData: Partial<EventDocument>) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');
  Object.assign(event, updateData);
  event.updated_at = new Date();
  return await event.save();
};

export const deleteEvent = async (eventId: string) => {
  return await Event.findByIdAndDelete(eventId);
};
