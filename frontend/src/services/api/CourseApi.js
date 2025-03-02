import { api } from "../Axios";

export async function createCoure(CourseData){
    try{
        const response = await api.post('/course', CourseData);
        return response.data;
    } catch(error){
        console.error('Create Course Failed: ', error);
        throw error;
    }
}