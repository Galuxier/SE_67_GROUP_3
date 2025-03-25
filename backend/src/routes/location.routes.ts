import express from 'express';
import {
  createLocationController,
  getLocationsController,
  getLocationByIdController,
  updateLocationController,
  deleteLocationController,
} from '../controllers/location.controller';

const router = express.Router();

router.post('/locations', createLocationController);
router.get('/locations', getLocationsController);
router.get('/location/:id', getLocationByIdController);
router.put('/location/:id', updateLocationController);
router.delete('/location/:id', deleteLocationController);

export default router;
