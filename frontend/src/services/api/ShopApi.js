import { api } from "../Axios";

export async function creatProduct(ProductData){
    try{
        const response = await api.post('/products', ProductData);
        return response.data;
    } catch(error){
        console.error('Create Product Failed: ', error);
        throw error;
    }
    
}

export async function registerShop(ShopData) {
    try{
        const response = await api.post('/shops', ShopData);
        return response.data;
    } catch(error){
        console.error('Register Shop Failed: ', error);
        throw error;
    }
    
}