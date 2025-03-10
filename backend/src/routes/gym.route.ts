import express from 'express';
import {
    createGymController,
    getGymsController,
    getGymByIdController,
    updateGymController,
    deleteGymController
} from '../controllers/gym.controller';
import { uploadMiddleware } from '../middlewares/upload';

const router = express.Router();

router.post('/gyms', uploadMiddleware, createGymController);

router.get('/gyms', getGymsController);

router.get('/gym/:id', getGymByIdController);

// router.put('/gym/:id', uploadMiddleware, updateGymController);
router.put('/gym/:id', updateGymController);


router.delete('/gym/:id', deleteGymController);

export default router;