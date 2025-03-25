import express from 'express';
import {
  createPlaceController,
  getPlacesController,
  getPlaceByIdController,
  updatePlaceController,
  deletePlaceController,
} from '../controllers/place.controller';

const router = express.Router();

router.post('/places', createPlaceController);
router.get('/places', getPlacesController);
router.get('/place/:id', getPlaceByIdController);
router.put('/place/:id', updatePlaceController);
router.delete('/place/:id', deletePlaceController);

export default router;
