import { api } from "../Axios";

export async function getAllEnrollment() {
    try{
        const response = await api.get('/enrollments');
        return response.data;
    } catch (error){
        console.error('Get All Gym Faild: ', error);
        throw error;
    }
}