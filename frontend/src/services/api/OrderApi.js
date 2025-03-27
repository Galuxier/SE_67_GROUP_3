import { api } from "../Axios";

export async function getUserOrders(user_id) {
    try{
        const response = await api.get(`/user/${user_id}/orders`);
        return response.data;
    } catch (error){
        console.error('Get All Gym Faild: ', error);
        throw error;
    }
}
