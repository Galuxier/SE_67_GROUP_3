import { api } from "../Axios";

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

export async function updateUser(userId, userData) { 
    try {
        const response = await api.put(`/user/${userId}`, userData);
        return response.data;
    } catch(error) {
        console.error('Update User Failed: ', error);
        throw error;
    }   
}