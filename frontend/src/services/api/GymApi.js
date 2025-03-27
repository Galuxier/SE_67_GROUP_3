import { api } from "../Axios";

export async function CreateGym(gymData) {
    try {
      const response = await api.post("/gyms", gymData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Create Gym Failed: ", error);
      throw error;
    } 
  }


  export async function checkGymNameExists(gymName) {
    try {
      const response = await api.get(`/gym/check-name/${encodeURIComponent(gymName)}`);
      return response.data;
    } catch (error) {
      console.error("Error checking gym name:", error);
      throw error;
    }
  }

// export const updateGym = async (gymId, formData) => {
//   try {
//     const response = await api.put(`/gym/${gymId}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data", // กำหนด headers สำหรับ FormData
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating gym:", error);
//     throw error;
//   }
// };

export const updateGym = async (gymId, formData) => {
  try {
    const response = await api.put(`/gym/${gymId}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating gym:", error);
    throw error;
  }
};

export async function getAllGyms() {
    try{
        const response = await api.get('/gyms');
        return response.data;
    } catch (error){
        console.error('Get All Gym Faild: ', error);
        throw error;
    }
}

export async function getGymFromId(id) {
    try{
        const response = await api.get(`/gym/${id}`)
        return response.data;
    } catch (error){
        console.error('Get All Gym Failed: ',error);
        throw error;
    }
    
}


/**
 * Search for gyms with various filter options
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search text to match against gym name and description
 * @param {string} [params.province] - Filter by province name from gym address
 * @param {string} [params.district] - Filter by district name from gym address
 * @param {string} [params.facility] - Filter by facility name
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.limit=10] - Number of results per page
 * @param {string} [params.sort] - Sort order (name, latest)
 * @returns {Promise<Object>} Response object with data and pagination info
 */
export async function searchGyms(params = {}) {
  try {
    const response = await api.get('/gyms/search', { params });
    return response.data;
  } catch (error) {
    console.error('Search Gyms Failed: ', error);
    throw error;
  }
}