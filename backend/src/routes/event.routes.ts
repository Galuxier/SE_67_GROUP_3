import express from 'express';
import {
  createEventController,
  getEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getEventsByOrganizerIdController
} from '../controllers/event.controller';

import { eventImageUpload } from '../middlewares/uploads/event.upload';

const router = express.Router();

router.post('/events', eventImageUpload,createEventController);
router.get('/events', getEventsController);
router.get('/event/:id', getEventByIdController);
router.put('/event/:id', updateEventController);
router.delete('/event/:id', deleteEventController);
router.get('/organizer/:organizer_id/events', getEventsByOrganizerIdController);

export default router;
