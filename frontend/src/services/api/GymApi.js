import { api } from "../Axios";

export async function CreateGym(gymData) {
    try {
      const response = await api.post("/gyms", gymData, {
        headers: {
          "Content-Type": "multipart/form-data", // กำหนด headers สำหรับ FormData
        },
      });
      return response.data;
    } catch (error) {
      console.error("Create Gym Failed: ", error);
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