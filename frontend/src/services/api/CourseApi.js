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