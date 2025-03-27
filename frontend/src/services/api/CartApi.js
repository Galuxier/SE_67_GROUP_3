// src/services/api/CartApi.js
import { api } from "../Axios";

/**
 * Get cart for a specific user
 * @param {string} userId - User ID
 * @returns {Promise} - Cart data
 */
export const getUserCart = async (userId) => {
    try {
      const response = await api.get(`/cart/user/${userId}`);
      return response.data ? response.data : response;
    } catch (error) {
      console.error('Error fetching user cart:', error);
      throw error;
    }
  };

/**
 * Add an item to the cart
 * @param {Object} cartItem - Item to add
 * @param {string} cartItem.user_id - User ID
 * @param {string} cartItem.shop_id - Shop ID
 * @param {string} cartItem.product_id - Product ID
 * @param {string} [cartItem.variant_id] - Variant ID (optional)
 * @param {number} cartItem.quantity - Quantity to add
 * @returns {Promise} - Updated cart
 */
export const addItemToCart = async ({ user_id, shop_id, product_id, variant_id, quantity }) => {
  try {
    const response = await api.post('/cart/add', {
      user_id,
      shop_id,
      product_id,
      variant_id,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 * @param {Object} cartItem - Item to remove
 * @param {string} cartItem.user_id - User ID
 * @param {string} cartItem.shop_id - Shop ID
 * @param {string} cartItem.variant_id - Variant ID
 * @returns {Promise} - Updated cart
 */
export const removeItemFromCart = async ({ user_id, shop_id, variant_id }) => {
  try {
    const response = await api.post('/cart/remove', {
      user_id,
      shop_id,
      variant_id
    });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};


/**
 * Update the quantity of an item in the cart
 * @param {Object} cartItem - Item to update
 * @param {string} cartItem.user_id - User ID
 * @param {string} cartItem.shop_id - Shop ID
 * @param {string} cartItem.variant_id - Variant ID
 * @param {number} cartItem.quantity - New quantity
 * @returns {Promise} - Updated cart
 */
export const updateCartItemQuantity = async ({ user_id, shop_id, variant_id, quantity }) => {
  try {
    const response = await api.post('/cart/update-quantity', {
      user_id,
      shop_id,
      variant_id,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

/**
 * Clear all items from the user's cart
 * This is a utility function that might require additional backend support
 * @param {string} userId - User ID
 * @returns {Promise} - Empty cart
 */
export const clearCart = async (userId) => {
  try {
    // If you don't have a specific endpoint for clearing the cart,
    // you could implement this by fetching the current cart and then
    // removing each item one by one
    const currentCart = await getUserCart(userId);
    
    if (!currentCart.data || !currentCart.data.shops || currentCart.data.shops.length === 0) {
      // Cart is already empty
      return currentCart;
    }
    
    // This is a placeholder for an actual implementation
    // You might want to add a specific endpoint for clearing the cart instead
    const response = await api.post('/cart/clear', { user_id: userId });
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Example usage for updating multiple items in a cart
 * @param {string} userId - User ID
 * @param {Array} items - Array of cart items with quantities
 * @returns {Promise} - Updated cart after all operations
 */
export const updateMultipleCartItems = async (userId, items) => {
  try {
    // Process each item update sequentially
    for (const item of items) {
      await updateCartItemQuantity({
        user_id: userId,
        shop_id: item.shop_id,
        variant_id: item.variant_id,
        quantity: item.quantity
      });
    }
    
    // Return the final updated cart
    return await getUserCart(userId);
  } catch (error) {
    console.error('Error updating multiple cart items:', error);
    throw error;
  }
};

/**
 * Function to sync local cart with server
 * Useful for handling guest carts when a user logs in
 * @param {string} userId - User ID 
 * @param {Object} localCart - Local cart from localStorage
 * @returns {Promise} - Updated server cart
 */
export const syncLocalCartWithServer = async (userId, localCart) => {
  try {
    if (!localCart || !localCart.shops || localCart.shops.length === 0) {
      // No local cart to sync
      return await getUserCart(userId);
    }

    // Add each item from local cart to server cart
    for (const shop of localCart.shops) {
      for (const item of shop.items) {
        await addItemToCart({
          user_id: userId,
          shop_id: shop.shop_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity
        });
      }
    }

    // Return the updated server cart
    return await getUserCart(userId);
  } catch (error) {
    console.error('Error syncing local cart with server:', error);
    throw error;
  }
};