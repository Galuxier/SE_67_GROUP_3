import { Course, CourseDocument } from '../models/course.model';
import {BaseService} from './base.service';
import { Types } from 'mongoose';

class CourseService extends BaseService<CourseDocument> {
  constructor() {
    super(Course);
  }

   

  async getCoursesByGymId(gymId: string): Promise<CourseDocument[]> {
    return await Course.find({ gym_id: new Types.ObjectId(gymId) });
  }
}

export default new CourseService;