import { api } from "../Axios";

export const getProducts = async (params = {}) => {
  try {
    console.log("params: ",params);
    
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Get Products Failed: ', error);
    throw error;
  }
};

// Product-related API functions
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData, {
      headers: {
        "Content-Type": "multipart/form-data" // For file uploads
      }
    });
    return response.data;
  } catch (error) {
    console.error('Create Product Failed: ', error);
    throw error;
  }
};



export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Product Failed: ', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/product/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data" // For file uploads
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update Product Failed: ', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Product Failed: ', error);
    throw error;
  }
};

export const getProductsByShop = async (shopId) => {
  try {
    const response = await api.get(`/shops/${shopId}/products`);
    return response.data;
  } catch (error) {
    console.error('Get Shop Products Failed: ', error);
    throw error;
  }
};