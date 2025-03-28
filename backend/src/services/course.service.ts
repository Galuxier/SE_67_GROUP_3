import { Course, CourseDocument, CourseStatus } from '../models/course.model';
import {BaseService} from './base.service';
import { Types } from 'mongoose';
import { Gym } from '../models/gym.model';

class CourseService extends BaseService<CourseDocument> {
  constructor() {
    super(Course);
  }

  async searchCourses(
    query: string = '',
    status?: string,
    gymId?: string,
    province?: string, // เพิ่ม province
    minPrice?: number,
    maxPrice?: number,
    level?: string,
    page: number = 1,
    limit: number = 12,
    sort?: string
  ): Promise<{ courses: CourseDocument[], total: number }> {
    const filter: any = {};
  
    // Add search query condition
    if (query && query.trim().length > 0) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { course_name: searchRegex },
        { description: searchRegex }
      ];
    }
  
    // Add status filter
    if (status) {
      filter.status = status;
    }
  
    // Add gym filter
    if (gymId) {
      filter.gym_id = new Types.ObjectId(gymId);
    }
  
    // Add level filter
    if (level) {
      filter.level = level;
    }
  
    // Add price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
  
    // Define sort options
    let sortOption: any = { start_date: -1 }; // Default sort by start_date DESC
    if (sort === 'low-to-high') { // แก้ไขจาก '  ' เป็น 'low-to-high'
      sortOption = { price: 1 };
    } else if (sort === 'high-to-low') {
      sortOption = { price: -1 };
    } else if (sort === 'latest') {
      sortOption = { start_date: -1 };
    } else if (sort === 'name') {
      sortOption = { course_name: 1 };
    }
  
    // Execute query with population
    const coursesQuery = Course.find(filter)
      .populate({
        path: 'gym_id',
        match: province ? { 'address.province': new RegExp(province, 'i') } : undefined,
        select: 'gym_name address'
      })
      .sort(sortOption)
      .lean();
  
    // Get all matching courses first
    const allCourses = await coursesQuery.exec();
    const filteredCourses = allCourses.filter(course => course.gym_id !== null);
  
    // Calculate pagination
    const skip = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(skip, skip + limit);
    const total = filteredCourses.length;
  
    return { courses: paginatedCourses, total };
  }

  async getCoursesByGymId(gymId: string): Promise<CourseDocument[]> {
    return await Course.find({ gym_id: new Types.ObjectId(gymId) });
  }

  async getPrepaingCourse(): Promise<CourseDocument[]>{
    return await Course.find({ status: CourseStatus.Preparing });
  }

  async getCoursesByUserOwnership(userId: string): Promise<CourseDocument[]> {
    try {
      // First find all gyms owned by this user
      const userOwnedGyms = await Gym.find({ owner_id: new Types.ObjectId(userId) })
        .select('_id');
      
      if (userOwnedGyms.length === 0) {
        return []; // User doesn't own any gyms
      }
      
      // Get gym IDs
      const gymIds = userOwnedGyms.map(gym => gym._id);
      
      // Find all courses that belong to these gyms
      const courses = await Course.find({ gym_id: { $in: gymIds } });
      
      return courses;
    } catch (error) {
      console.error('Error fetching courses by user ownership:', error);
      throw error;
    }
  }
}

export default new CourseService;