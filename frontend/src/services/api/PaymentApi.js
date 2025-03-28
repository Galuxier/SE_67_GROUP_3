import { api } from "../Axios";

/**
 * Create a new payment
 * 
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.order_id - Order ID
 * @param {string} paymentData.user_id - User ID
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.payment_method - Payment method (e.g., "credit_card", "bank_transfer", "promptpay")
 * @param {string} [paymentData.payment_status] - Optional payment status (defaults to "pending")
 * @returns {Promise<Object>} - The created payment
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Create Payment Failed: ', error);
    throw error;
  }
};

/**
 * Get payments with optional filters
 * 
 * @param {Object} [params] - Optional filter parameters
 * @param {string} [params.order_id] - Filter by order ID
 * @param {string} [params.user_id] - Filter by user ID
 * @param {string} [params.status] - Filter by payment status
 * @returns {Promise<Object>} - Payments data with count and success status
 */
export const getPayments = async (params = {}) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error) {
    console.error('Get Payments Failed: ', error);
    throw error;
  }
};

/**
 * Get a specific payment by ID
 * 
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} - The payment data
 */
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payment/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Get Payment Failed: ', error);
    throw error;
  }
};

/**
 * Update payment status
 * 
 * @param {string} paymentId - Payment ID
 * @param {string} status - New payment status
 * @returns {Promise<Object>} - The updated payment
 */
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const response = await api.put(`/payment/${paymentId}`, { payment_status: status });
    return response.data;
  } catch (error) {
    console.error('Update Payment Status Failed: ', error);
    throw error;
  }
};

/**
 * Update payment details
 * 
 * @param {string} paymentId - Payment ID
 * @param {Object} updateData - Data to update
 * @param {number} [updateData.amount] - New amount
 * @param {string} [updateData.payment_method] - New payment method
 * @returns {Promise<Object>} - The updated payment
 */
export const updatePayment = async (paymentId, updateData) => {
  try {
    const response = await api.put(`/payment/${paymentId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Update Payment Failed: ', error);
    throw error;
  }
};

/**
 * Delete a payment
 * 
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} - The deleted payment
 */
export const deletePayment = async (paymentId) => {
  try {
    const response = await api.delete(`/payment/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Delete Payment Failed: ', error);
    throw error;
  }
};