import express from 'express';
import {
    createGymController,
    getGymsController,
    getGymByIdController,
    updateGymController,
    deleteGymController
} from '../controllers/gym.controller';

const router = express.Router();

router.post('/gyms', createGymController);

router.get('/gyms', getGymsController);

router.get('/gym/:id', getGymByIdController);

router.put('/gym', updateGymController);

router.delete('/gym/:id', deleteGymController);

export default router;