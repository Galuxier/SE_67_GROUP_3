import express from 'express';
import {
  createRecommendController,
  getRecommendsController,
  getRecommendByIdController,
  updateRecommendController,
  deleteRecommendController,
} from '../controllers/recommend.controller';

const router = express.Router();

router.post('/recommends', createRecommendController);
router.get('/recommends', getRecommendsController);
router.get('/recommend/:id', getRecommendByIdController);
router.put('/recommend/:id', updateRecommendController);
router.delete('/recommend/:id', deleteRecommendController);

export default router;
