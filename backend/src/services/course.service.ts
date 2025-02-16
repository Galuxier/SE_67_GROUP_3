import { Course, CourseDocument } from '../models/course.model';

export const createCourse = async (courseData: CourseDocument) => {
  return await Course.create(courseData);
};

export const getCourses = async () => {
  return await Course.find().populate('trainer gym');
};

export const getCourseById = async (courseId: string) => {
  return await Course.findById(courseId).populate('trainer gym');
};

export const updateCourse = async (courseId: string, updateData: Partial<CourseDocument>) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  Object.assign(course, updateData);
  course.updated_at = new Date();
  return await course.save();
};

export const deleteCourse = async (courseId: string) => {
  return await Course.findByIdAndDelete(courseId);
};
