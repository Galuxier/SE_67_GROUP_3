import { Request, Response } from 'express';
import CourseService from '../services/course.service';
import { Types } from 'mongoose';

// สร้างคอร์สใหม่
export const createCourseController = async (req: Request, res: Response) => {
  try {
    if (req.body.activities) {
      req.body.activities = JSON.parse(req.body.activities);
    }

    if (req.body.trainer_in_course){
      req.body.trainer_in_course = JSON.parse(req.body.trainer_in_course);
    }
    console.log(req.body);
    
    const newCourse = await CourseService.add(req.body);

    res.status(201).json({
      success: true,
      message: "Create Course Successfull",
      data: newCourse
    });
  } catch (err) {
    console.log(err);
    
    res.status(400).json({ message: 'Error creating course', error: err });
  }
};

export const searchCoursesController = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { 
      query = '', 
      status, 
      gym_id, 
      province, // เพิ่ม province
      min_price, 
      max_price,
      level,
      page = '1',
      limit = '10',
      sort
    } = req.query;
    
    // Parse numeric parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const minPrice = min_price ? parseFloat(min_price as string) : undefined;
    const maxPrice = max_price ? parseFloat(max_price as string) : undefined;
    
    // Search for courses with filters
    const { courses, total } = await CourseService.searchCourses(
      query as string,
      status as string | undefined,
      gym_id as string | undefined,
      province as string | undefined, // เพิ่ม province
      minPrice,
      maxPrice,
      level as string | undefined,
      pageNum,
      limitNum,
      sort as string | undefined
    );
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: courses
    });
  } catch (err) {
    console.error('Error searching courses:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error searching courses', 
      error: err 
    });
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

export const getPrepaingCourseController = async (req: Request, res: Response) => {
  try {
    const courses = await CourseService.getPrepaingCourse();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err });
  }
};

export const getCoursesByGymIdController = async (req: Request, res: Response) => {
  try {
    const gymId = req.params.gymId;
    
    // Validate gym ID
    if (!Types.ObjectId.isValid(gymId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid gym ID format'
      });
      return;
    }
    
    const courses = await CourseService.getCoursesByGymId(gymId);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.error('Error fetching gym courses:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching gym courses', 
      error: err 
    });
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
    if (req.body.activities) {
      req.body.activities = JSON.parse(req.body.activities);
    }

    if (req.body.trainer_in_course){
      req.body.trainer_in_course = JSON.parse(req.body.trainer_in_course);
    }
    console.log(req.body);
    const updatedCourse = await CourseService.update(req.params.id, req.body);
    res.status(200).json(updatedCourse);
  } catch (err) {
    console.log(err);
    
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