import { api } from "../api";

export async function getUser(_id) {
    try{
        const response = await api.get(`/user/${_id}`);
        console.log(response.data);
        return response.data;
    } catch(error){
        console.error('Failed to get User: ', error);
        throw error;
    }
    
}