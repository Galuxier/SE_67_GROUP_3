import { useState } from "react";
import { loginUser } from "../services/api/AuthApi"; // นำเข้า loginUser จาก AuthApi
import { useNavigate } from "react-router-dom"; // ใช้สำหรับ redirect
import { useAuth } from "../context/AuthContext"; // นำเข้า useAuth

const Login = () => {
  const [formInput, setFormInput] = useState({
    identifier: "", // ใช้ identifier สำหรับรับทั้ง username และ email
    password: "",
  });

  const [formError, setFormError] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate(); // ใช้สำหรับ redirect
  const { login } = useAuth(); // ใช้ login function จาก useAuth

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // เคลียร์ข้อความ error ทั้งหมด
    setFormError({
      identifier: "",
      password: "",
    });
  
    // ตรวจสอบความถูกต้องของฟอร์ม
    if (!formInput.identifier || !formInput.password) {
      setFormError({
        identifier: !formInput.identifier ? "Please enter your email or username" : "",
        password: !formInput.password ? "Please enter your password" : "",
      });
      return;
    }
  
    try {
      // เรียกใช้ฟังก์ชัน loginUser จาก AuthApi
      const { token, user } = await loginUser({
        identifier: formInput.identifier,
        password: formInput.password,
      });
      // ตรวจสอบว่า token และ user มีค่าหรือไม่
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }
  
      // บันทึก token ลงใน localStorage
      localStorage.setItem("token", token);
  
      // อัปเดตสถานะการล็อกอิน
      login(user);
  
      // Redirect ไปยังหน้าหลัก
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
  
      // จัดการข้อผิดพลาดที่ส่งกลับมาจาก Backend
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
  
        // แสดงข้อความผิดพลาดที่เหมาะสม
        if (errorMessage === "Invalid email/username or password") {
          setFormError({
            identifier: "Invalid email/username or password",
            password: "Invalid email/username or password",
          });
        } else if (errorMessage === "User not found") {
          setFormError({
            identifier: "User not found. Please check your email/username",
            password: "",
          });
        } else {
          setFormError({
            identifier: "An error occurred. Please try again.",
            password: "",
          });
        }
      } else {
        // ข้อผิดพลาดที่ไม่รู้จัก
        setFormError({
          identifier: "An error occurred. Please try again.",
          password: "",
        });
      }
    }
  };

  // ฟังก์ชันสำหรับปุ่ม Cancel
  const handleCancel = () => {
    navigate("/"); // Redirect ไปยังหน้า Home
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-3xl block text-center font-semibold py-2">Login</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          {/* ช่องกรอก email/username */}
          <div className="mb-4">
            <input
              type="text"
              name="identifier"
              value={formInput.identifier}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500 ${
                formError.identifier ? "border-red-500" : ""
              }`}
              placeholder="Email/Username"
            />
            {formError.identifier && (
              <p className="text-red-500 text-sm mt-1">{formError.identifier}</p>
            )}
          </div>
  
          {/* ช่องกรอก password */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formInput.password}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500 ${
                formError.password ? "border-red-500" : ""
              }`}
              placeholder="Password"
            />
            {formError.password && (
              <p className="text-red-500 text-sm mt-1">{formError.password}</p>
            )}
          </div>
  
          {/* ปุ่ม Login และ Cancel */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-rose-600 border rounded py-2 px-3 focus:outline-none"
            >
              <label className="text-white">LOGIN</label>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-500 border rounded py-2 px-3 focus:outline-none hover:bg-gray-600"
            >
              <label className="text-white">CANCEL</label>
            </button>
          </div>
        </form>
  
        {/* ลิงก์ Forgot Password */}
        <div>
          <label className="block text-center py-2 text-rose-600">
            Forgot Password
          </label>
        </div>
        <hr className="bg-red-500 border-red-500" />
  
        {/* ลิงก์ Register */}
        <div>
          <label className="block text-center py-2 text-rose-600">Register</label>
        </div>
      </div>
    </div>
  );
};

export default Login;