import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api/AuthApi";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify"; // นำเข้า toast สำหรับแสดงข้อความแจ้งเตือน
import "react-toastify/dist/ReactToastify.css"; // CSS สำหรับ toast
import { ClipLoader } from "react-spinners"; // นำเข้า Spinner

const Login = () => {
  const [formInput, setFormInput] = useState({
    identifier: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    identifier: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false); // สถานะ Loading

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // เคลียร์ข้อความ error
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
  
    setIsLoading(true); // เริ่ม Loading
  
    try {
      // เรียกใช้ฟังก์ชัน loginUser
      const { token, user } = await loginUser({
        identifier: formInput.identifier,
        password: formInput.password,
      });
  
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }
  
      // บันทึก token ลงใน localStorage
      localStorage.setItem("token", token);
  
      login(user);

      toast.success("Login สำเร็จ!", {
        position: "top-right",
        autoClose: 1000,
      });

      navigate(-1);
    } catch (error) {
      console.error("Login failed:", error);
  
      // จัดการข้อผิดพลาด
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
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
        setFormError({
          identifier: "An error occurred. Please try again.",
          password: "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
      <ToastContainer /> {/* Container สำหรับแสดง Toast */}
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 mb-4">
          ← Back
        </button>

        <h1 className="text-3xl block text-center font-semibold py-2">Login</h1>
        {/* <hr /> */}
        <form onSubmit={handleSubmit}>
          {/* ช่องกรอก email/username */}
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Username/E-mail
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formInput.identifier}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500 ${
                formError.identifier ? "border-red-500" : ""
              }`}
              placeholder="Enter your email or username"
            />
            {formError.identifier && (
              <p className="text-red-500 text-sm mt-1">{formError.identifier}</p>
            )}
          </div>

          {/* ช่องกรอก password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formInput.password}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500 ${
                formError.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
            />
            {formError.password && (
              <p className="text-red-500 text-sm mt-1">{formError.password}</p>
            )}
          </div>

          {/* ปุ่ม Login และ Cancel */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-rose-600 border rounded py-2 px-3 focus:outline-none flex items-center justify-center"
              disabled={isLoading} // ปิดปุ่มขณะ Loading
            >
              {isLoading ? (
                <ClipLoader size={20} color="#ffffff" /> // แสดง Spinner
              ) : (
                <label className="text-white">LOGIN</label>
              )}
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
          <Link to="/signup" className="block text-center py-2 text-rose-600 hover:text-rose-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;