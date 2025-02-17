import { Course, CourseDocument } from '../models/course.model';
import {BaseService} from './base.service';

export class CourseService extends BaseService<CourseDocument> {
  constructor() {
    super(Course);
  }
}