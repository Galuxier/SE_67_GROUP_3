import { api } from "../Axios";

export async function CreateGym(GymData) {
    try{
        const response = await api.post('/gyms', GymData);
        return response.data;
    } catch(error){
        console.error('Create Gym Failed: ', error)
        throw error;
    }   
}

export async function getAllGyms() {
    try{
        const response = await api.get('/gyms');
        return response.data;
    } catch (error){
        console.error('Get All Gym Faild: ', error);
        throw error;
    }
}