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

export async function getOrdersByShopId(shop_id, status = '') {
    try {
        const url = status 
            ? `/shop/${shop_id}/orders?status=${status} `
            : `/shop/${shop_id}/orders`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Get Shop Orders Failed: ', error);
        throw error;
    }
}
