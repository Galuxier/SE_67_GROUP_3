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

export async function getAllCourses() {
    try{
        const response = await api.get('/courses');
        return response.data;
    }catch (error){
        console.error(error);
        throw new error;
        
    }
}