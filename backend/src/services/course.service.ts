import { Course, CourseDocument } from '../models/course.model';
import {BaseService} from './base.service';

class CourseService extends BaseService<CourseDocument> {
  constructor() {
    super(Course);
  }
}

export default new CourseService;