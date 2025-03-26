import { api } from "../Axios";

export async function getNotifications(_id) {
    try{
        const response = await api.get(`/notifications/${_id}`);
        console.log(response);
        return response;   
    } catch (error){
        console.error(error);
        throw new error;
        
    }
}