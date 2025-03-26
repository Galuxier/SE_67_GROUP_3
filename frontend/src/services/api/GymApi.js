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

export async function getTrainersInGym(gym_id) {
  const trainer = [
    {
      _id: "67ddcb82b808034424fd0c21",
      image_url: new URL("../assets/images/coach1.jpg", import.meta.url).href,
      firstName: "นายเก้า",
      lastName: "เท็นสิบ",
      Nickname: "โค้ชนาย",
      detail: "คนหล่อคนนี้เป็นของคุณนะ",
      contact: "095555555",
      course: "หน่วยรบพิเศษ",
      fightHistory: "win 1 lose 10",
      gym: "Phuket Fight Club",
    },
    {
      _id: "67ddcefcb808034424fd0c40",
      image_url: new URL("../assets/images/coach2.jpg", import.meta.url).href,
      firstName: "นายสิบ",
      lastName: "สิบสาม",
      Nickname: "โค้ชอ้วน",
      detail: "แคนนแค่นแค้นแค๊น",
      contact: "0932111111",
      course: "หน่วยรบพิเศษเสือคาบดอกไม้",
      fightHistory: "win 2 lose 1",
      gym: "Bangkok Fight Club",
    },
    {
      _id: "67ddc96ca738e660fd2915a3",
      profile_picture_url: 'users/profiles/1742808301270-profile_picture_url.jpg',
      first_name: "นายสิบเอ็ด",
      last_name: "เจ็ดแปดเก้า",
      nickname: "โค้ชเก่ง",
    },
  ];

  return trainer;
}
