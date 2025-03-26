import express from 'express';
import{
    createCourseController,
    getCoursesController,
    getCourseByIdController,
    updateCourseController,
    deleteCourseController,
    getCoursesByGymIdController
} from '../controllers/course.controller';
import { courseImagesUpload } from '../middlewares/uploads/course.upload';

const route = express.Router();

route.get('/courses', getCoursesController);

route.get('/course/:id', getCourseByIdController);

route.post('/course',courseImagesUpload ,createCourseController);

route.put('/course/:id', updateCourseController);

route.delete('/course/:id', deleteCourseController);

route.get('/gym/:gymId/courses', getCoursesByGymIdController);

export default route;