import { Request, Response } from 'express';
import TicketService from '../services/ticket.service';

export const createTicketController = async (req: Request, res: Response) => {
  try {
    const newTicket = await TicketService.add(req.body);
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ message: 'Error creating ticket', error: err });
  }
};

export const getTicketsController = async (req: Request, res: Response) => {
  try {
    const tickets = await TicketService.getAll();
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err });
  }
};

export const getTicketByIdController = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketService.getById(req.params.id);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ticket', error: err });
  }
};

export const updateTicketController = async (req: Request, res: Response) => {
  try {
    const updatedTicket = await TicketService.update(req.params.id, req.body);
    res.status(200).json(updatedTicket);
  } catch (err) {
    res.status(500).json({ message: 'Error updating ticket', error: err });
  }
};

export const deleteTicketController = async (req: Request, res: Response) => {
  try {
    const deletedTicket = await TicketService.delete(req.params.id);
    res.status(200).json(deletedTicket);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket', error: err });
  }
};