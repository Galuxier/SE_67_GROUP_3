import { api } from "../Axios";

/**
 * Get packages owned by a user with optional type filter
 * @param {string} userId - The user ID to get packages for
 * @param {string} [type] - Optional package type filter ('course' or 'event')
 * @returns {Promise<Object>} - Response containing the owned packages
 */
export async function getUserPackages(userId, type = '') {
  try {
    const url = type 
      ? `/user/${userId}/packages?type=${type}` 
      : `/user/${userId}/packages`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Get User Packages Failed: ', error);
    throw error;
  }
}

/**
 * Mark a package as used for a specific course or event
 * @param {string} packageId - The package ID to mark as used
 * @param {string} refId - The course or event ID that will use this package
 * @returns {Promise<Object>} - Response containing the updated package
 */
export async function usePackage(packageId, refId) {
  try {
    const response = await api.post(`/packages/${packageId}/use`, { refId });
    return response.data;
  } catch (error) {
    console.error('Use Package Failed: ', error);
    throw error;
  }
}

/**
 * Create packages from a paid order (typically called by system)
 * @param {string} orderId - The order ID to create packages from
 * @returns {Promise<Object>} - Response with created packages
 */
export async function createPackagesFromOrder(orderId) {
  try {
    const response = await api.post(`/order/${orderId}/packages`);
    return response.data;
  } catch (error) {
    console.error('Create Packages Failed: ', error);
    throw error;
  }
}