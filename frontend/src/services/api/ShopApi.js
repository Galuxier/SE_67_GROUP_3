import { api } from "../Axios";

// Create a new product
export async function createProduct(productData) {
  try {
    const response = await api.post('/products', productData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create Product Failed: ', error);
    throw error;
  }
}

// Register a new shop
export async function registerShop(shopData) {
  try {
    const response = await api.post('/shops', shopData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('Register Shop Failed: ', error);
    throw error;
  }
}

// Update an existing shop
export async function updateShop(id, shopData) {
  try {
    // Check if shopData is FormData (has files)
    const isFormData = shopData instanceof FormData;
    
    const config = isFormData ? {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    } : {};
    
    const response = await api.put(`/shops/${id}`, shopData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
}

// Get a specific shop by ID
export async function getShopById(id) {
  try {
    const response = await api.get(`/shop/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop:", error);
    throw error;
  }
}

// Get all shops for the current user
export async function getUserShops(user_id) {
  try {
    const response = await api.get(`/shops/user/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user shops:", error);
    throw error;
  }
}

// Get all products for a specific shop
export async function getShopProducts(shopId) {
  try {
    const response = await api.get(`/shops/${shopId}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop products:", error);
    throw error;
  }
}

// Get shop orders
export async function getShopOrders(shopId, status = '') {
  try {
    const url = status 
      ? `/shop/orders/${shopId}?status=${status}` 
      : `/shop/orders/${shopId}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    throw error;
  }
}

// Update an order status
export async function updateOrderStatus(orderId, status) {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Get shop analytics/statistics
export async function getShopAnalytics(shopId, period = 'weekly') {
  try {
    const response = await api.get(`/shops/${shopId}/analytics?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop analytics:", error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(productId) {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Update product stock/inventory
export async function updateProductStock(productId, stock) {
  try {
    const response = await api.put(`/products/${productId}/stock`, { stock });
    return response.data;
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
}

// export default {
//   createProduct,
//   registerShop,
//   updateShop,
//   getShopById,
//   getUserShops,
//   getShopProducts,
//   getShopOrders,
//   updateOrderStatus,
//   getShopAnalytics,
//   deleteProduct,
//   updateProductStock
// };