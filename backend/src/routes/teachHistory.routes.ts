import express from 'express';
import {
  createTeachHistoryController,
  getTeachHistoriesController,
  getTeachHistoryByIdController,
  updateTeachHistoryController,
  deleteTeachHistoryController,
  getTeachHistoriesByUserIdController
} from '../controllers/teachHistory.controller';

const router = express.Router();

router.post('/teachHistories', createTeachHistoryController);
router.get('/teachHistories', getTeachHistoriesController);
router.get('/teachHistory/:id', getTeachHistoryByIdController);
router.put('/teachHistory/:id', updateTeachHistoryController);
router.delete('/teachHistory/:id', deleteTeachHistoryController);
router.get('/user/:userId/teachHistories', getTeachHistoriesByUserIdController);

export default router;
