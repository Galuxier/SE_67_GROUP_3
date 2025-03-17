import { api } from "../Axios";

export const getImage = async (imageUrl) => {
    try {
      const response = await api.get(`/images/${imageUrl}`, {
        responseType: "blob", // response เป็นชนิดไฟล์ blob
      });
      return URL.createObjectURL(response.data); // แปลง blob เป็น URL สำหรับแสดงรูป
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  };