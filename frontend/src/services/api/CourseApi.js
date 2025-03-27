import { api } from "../Axios";

export async function createCourse(CourseData){
    try{
        const response = await api.post('/course', CourseData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch(error){
        console.error('Create Course Failed: ', error);
        throw error;
    }
}

export async function getCoursesByGymId(gym_id) {
    try {
      const response = await api.get(`/gym/${gym_id}/courses`);
      return response.data;
    } catch (error) {
      console.error('Get Gym Courses Failed: ', error);
      throw error;
    }
}
export async function getCourseById(course_id) {
    try{
        const response = await api.get(`/course/${course_id}`);
        return response.data;
    }catch (error){
        console.error(error);
        throw new error;

    }
}
export async function getAllCourses() {
    try{
        const response = await api.get('/courses');
        return response.data;
    }catch (error){
        console.error(error);
        throw new error;
        
    }
}

/**
 * Search for courses with various filter options
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search text to match against course name and description
 * @param {string} [params.status] - Filter by course status (preparing, ongoing, finished, cancel)
 * @param {string} [params.gym_id] - Filter by gym ID
 * @param {string} [params.level] - Filter by course level (for_kid, beginner, advance)
 * @param {number} [params.min_price] - Minimum price filter
 * @param {number} [params.max_price] - Maximum price filter
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.limit=10] - Number of results per page
 * @param {string} [params.sort] - Sort order (low-to-high, high-to-low, latest, name)
 * @returns {Promise<Object>} Response object with data and pagination info
 */
export async function searchCourses(params = {}) {
  try {
    const response = await api.get('/courses/search', { params });
    return response.data;
  } catch (error) {
    console.error('Search Courses Failed: ', error);
    throw error;
  }
}