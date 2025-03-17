import {api} from "../Axios";

export async function loginUser(credentials) {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    // เตรียมข้อมูลให้ตรงกับที่เซิร์ฟเวอร์คาดหวัง
    const payload = {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: ["member"], // กำหนด role เริ่มต้น
      status: "active", // กำหนด status เริ่มต้น
      create_at: new Date(), // เพิ่ม create_at
    };

    const response = await api.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.response?.data); // ตรวจสอบข้อความผิดพลาดจากเซิร์ฟเวอร์

    // Throw error ที่มีข้อความเฉพาะ
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message); // Throw ข้อความที่ Backend ส่งกลับมา
    } else {
      throw new Error("Signup failed. Please try again."); // ข้อผิดพลาดทั่วไป
    }
  }
}