import { Request, Response } from 'express';
import EventsService from '../services/event.service';
import { Types } from 'mongoose';

export const createEventController = async (req: Request, res: Response) => {
  try {
    req.body.seat_zones = JSON.parse(req.body.seat_zones);
    req.body.weight_classes = JSON.parse(req.body.weight_classes);
    const newEvent = await EventsService.add(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: 'Error creating event', error: err });
  }
};

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const events = await EventsService.getAll();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err });
  }
};

export const getEventsByOrganizerIdController = async (req: Request, res: Response) => {
  try {
    const organizer_id = req.params.organizer_id;
    
    // Validate gym ID
    if (!Types.ObjectId.isValid(organizer_id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid organizer ID format'
      });
      return;
    }
    
    const events = await EventsService.getEventByOrganizerId(organizer_id);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    console.error('Error fetching event from org id:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching event from org id', 
      error: err 
    });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const event = await EventsService.getById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err });
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await EventsService.update(req.params.id, req.body);
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err });
  }
};

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await EventsService.delete(req.params.id);
    res.status(200).json(deletedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err });
  }
};

export const searchEventsController = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { 
      query = '', 
      level, 
      province, // เพิ่ม province
      location_name, // เปลี่ยนจาก location_id เป็น location_name
      min_date, 
      max_date,
      page = '1',
      limit = '10',
      sort
    } = req.query;
    
    // Parse numeric parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    
    // Parse date parameters
    const minDate = min_date ? new Date(min_date as string) : undefined;
    const maxDate = max_date ? new Date(max_date as string) : undefined;
    
    // Search for events with filters
    const { events, total } = await EventsService.searchEvents(
      query as string,
      province as string | undefined, // เพิ่ม province
      location_name as string | undefined, // เปลี่ยนเป็น location_name
      minDate,
      maxDate,
      level as string | undefined,
      pageNum,
      limitNum,
      sort as string | undefined
    );
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: events
    });
  } catch (err) {
    console.error('Error searching events:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error searching events', 
      error: err 
    });
  }
};