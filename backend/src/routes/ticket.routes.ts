import express from 'express';
import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  updateTicketController,
  deleteTicketController,
} from '../controllers/ticket.controller';

const router = express.Router();

router.post('/tickets', createTicketController);
router.get('/tickets', getTicketsController);
router.get('/ticket/:id', getTicketByIdController);
router.put('/ticket/:id', updateTicketController);
router.delete('/ticket/:id', deleteTicketController);

export default router;
