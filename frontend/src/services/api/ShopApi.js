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

export const updateShop = async (id, shopData) => {
  try {
    const response = await api.put(`/shop/${id}`, shopData); // ใช้ PUT หรือ PATCH ตามที่ backend กำหนด
    return response.data;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
};

export const getShopFromId = async (id) => {
    try {
      const response = await api.get(`/shop/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching shop:", error);
      throw error;
    }
  };