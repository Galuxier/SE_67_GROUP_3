import express from 'express';
import{
    createCourseController,
    getCoursesController,
    getCourseByIdController,
    updateCourseController,
    deleteCourseController
} from '../controllers/course.controllers';

const route = express.Router();

route.get('/courses', getCoursesController);

route.get('/course/:id', getCourseByIdController);

route.post('/course', createCourseController);

route.put('/course/:id', updateCourseController);

route.delete('/course/:id', deleteCourseController);

export default route;