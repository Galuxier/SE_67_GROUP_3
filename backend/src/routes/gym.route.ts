import express from 'express';
import {
    createGymController,
    getGymsController,
    getGymByIdController,
    updateGymController,
    deleteGymController
} from '../controllers/gym.controller';
import { gymImagesUpload } from '../middlewares/uploads/gym.upload';

const router = express.Router();

router.post('/gyms', gymImagesUpload, createGymController);

router.get('/gyms', getGymsController);

router.get('/gym/:id', getGymByIdController);

// router.put('/gym/:id', uploadMiddleware, updateGymController);
router.put('/gym/:id', updateGymController);


router.delete('/gym/:id', deleteGymController);

export default router;