import express from 'express';
import{
    createCourseController,
    getCoursesController,
    getCourseByIdController,
    updateCourseController,
    deleteCourseController,
    getCoursesByGymIdController,
    getPrepaingCourseController,
    searchCoursesController,
    getCoursesByUserOwnershipController
} from '../controllers/course.controller';
import { courseImagesUpload } from '../middlewares/uploads/course.upload';

const route = express.Router();

route.get('/courses', getCoursesController);

route.get('/courses/preparing', getPrepaingCourseController);

route.get('/course/:id', getCourseByIdController);

route.post('/course',courseImagesUpload ,createCourseController);

route.put('/course/:id', courseImagesUpload, updateCourseController);

route.delete('/course/:id', deleteCourseController);

route.get('/gym/:gymId/courses', getCoursesByGymIdController);

route.get('/courses/search', searchCoursesController);

route.get('/user/:userId/courses', getCoursesByUserOwnershipController);

export default route;