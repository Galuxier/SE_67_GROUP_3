import { api } from "../Axios";

// Variant-related API functions
export const createVariant = async (variantData) => {
  try {
    const response = await api.post('/variants', variantData, {
      headers: {
        "Content-Type": "multipart/form-data" // For file uploads
      }
    });
    return response.data;
  } catch (error) {
    console.error('Create Variant Failed: ', error);
    throw error;
  }
};

export const createManyVariants = async (variantsData) => {
  try {
    const response = await api.post('/variants/batch', variantsData);
    return response.data;
  } catch (error) {
    console.error('Create Many Variants Failed: ', error);
    throw error;
  }
};

export const getVariants = async () => {
  try {
    const response = await api.get('/variants');
    return response.data;
  } catch (error) {
    console.error('Get Variants Failed: ', error);
    throw error;
  }
};

export const getVariantById = async (id) => {
  try {
    const response = await api.get(`/variant/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Variant Failed: ', error);
    throw error;
  }
};

export const getVariantsByProductId = async (productId) => {
  try {
    const response = await api.get(`/product/${productId}/variants`);
    return response.data;
  } catch (error) {
    console.error('Get Product Variants Failed: ', error);
    throw error;
  }
};

export const updateVariant = async (id, variantData) => {
  try {
    const response = await api.put(`/variant/${id}`, variantData, {
      headers: {
        "Content-Type": "multipart/form-data" // For file uploads
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update Variant Failed: ', error);
    throw error;
  }
};

export const updateVariantStock = async (id, quantity) => {
  try {
    const response = await api.patch(`/variant/${id}/stock`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Update Variant Stock Failed: ', error);
    throw error;
  }
};

export const deleteVariant = async (id) => {
  try {
    const response = await api.delete(`/variant/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Variant Failed: ', error);
    throw error;
  }
};

export const deleteVariantsByProductId = async (productId) => {
  try {
    const response = await api.delete(`/product/${productId}/variants`);
    return response.data;
  } catch (error) {
    console.error('Delete Product Variants Failed: ', error);
    throw error;
  }
};