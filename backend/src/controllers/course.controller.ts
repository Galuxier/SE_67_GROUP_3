import { Request, Response } from 'express';
import CourseService from '../services/course.service';

// สร้างคอร์สใหม่
export const createCourseController = async (req: Request, res: Response) => {
  try {
    if (req.body.activities) {
      req.body.activities = JSON.parse(req.body.activities);
    }
    console.log(req.body);
    
    const newCourse = await CourseService.add(req.body);

    res.status(201).json({
      success: true,
      message: "Create Course Successfull",
      data: newCourse
    });
  } catch (err) {
    res.status(400).json({ message: 'Error creating course', error: err });
  }
};

// ดึงข้อมูลคอร์สทั้งหมด
export const getCoursesController = async (req: Request, res: Response) => {
  try {
    const courses = await CourseService.getAll();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err });
  }
};

// ดึงข้อมูลคอร์สจาก _id
export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const course = await CourseService.getById(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err });
  }
};

// อัปเดตข้อมูลคอร์ส
export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const updatedCourse = await CourseService.update(req.params.id, req.body);
    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err });
  }
};

// ลบคอร์ส
export const deleteCourseController = async (req: Request, res: Response) => {
  try {
    const deletedCourse = await CourseService.delete(req.params.id);
    res.status(200).json(deletedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err });
  }
};