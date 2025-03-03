import { useState } from "react";
import "../index.css";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { signupUser } from "../services/api/AuthApi"; // นำเข้า signupUser จาก AuthApi
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // ใช้สำหรับ redirect

function RegisterForm() {
  const [formInput, setFormInput] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [formError, setFormError] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    general: "", // เพิ่มฟิลด์ general สำหรับข้อผิดพลาดทั่วไป
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // ฟังก์ชันเคลียร์ข้อความ error ของฟิลด์ที่เกี่ยวข้อง
  const clearError = (field) => {
    setFormError((prev) => ({ ...prev, [field]: "" }));
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงค่าในฟิลด์
  const handleInputChange = (field, value) => {
    setFormInput((prev) => ({ ...prev, [field]: value })); // อัปเดตค่าในฟิลด์
    clearError(field); // เคลียร์ข้อความ error ของฟิลด์นั้น
  };

  // ฟังก์ชันตรวจสอบความถูกต้องของฟอร์ม
  const validateFormInput = (event) => {
    event.preventDefault();

    let inputError = {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      general: "",
    };

    if (!formInput.username) {
      inputError.username = "Please enter your username";
    }
    if (!formInput.firstName) {
      inputError.firstName = "Please enter your first name";
    }
    if (!formInput.lastName) {
      inputError.lastName = "Please enter your last name";
    }
    if (!formInput.email) {
      inputError.email = "Please enter your email address";
    }
    if (!formInput.password) {
      inputError.password = "Please enter your password";
    }
    if (!formInput.repeatPassword) {
      inputError.repeatPassword = "Please confirm your password";
    }
    if (formInput.password !== formInput.repeatPassword) {
      inputError.repeatPassword = "Passwords don't match!";
    }
    setFormError(inputError);

    // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
    const hasErrors = Object.values(inputError).some((error) => error !== "");
    return !hasErrors;
  };

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();

    // เคลียร์ข้อความ error ทั้งหมด
    setFormError({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      general: "",
    });

    // ตรวจสอบความถูกต้องของฟอร์ม
    const isValid = validateFormInput(event);
    if (!isValid) {
      console.log("Form has errors. Please fix them.");
      return;
    }

    // ส่งข้อมูลไปยัง API
    try {
      const userData = {
        user_name: formInput.username,
        first_name: formInput.firstName,
        last_name: formInput.lastName,
        email: formInput.email,
        password: formInput.password,
      };

      const response = await signupUser(userData); // เรียกใช้ signupUser
      console.log("Registration successful:", response);

      // แสดงข้อความสำเร็จ
      setFormError({ ...formError, general: "Registration successful!" });

      // Redirect หรือทำอย่างอื่นหลังจากลงทะเบียนสำเร็จ
    } catch (error) {
      console.error("Error during registration:", error.response?.data);

      // จัดการข้อผิดพลาดที่ส่งกลับมาจาก Backend
      if (error.message === "Email already exists") {
        setFormError({ ...formError, email: "Email already exists", general: "" });
      } else if (error.message === "Username already exists") {
        setFormError({ ...formError, username: "Username already exists", general: "" });
      } else {
        setFormError({ ...formError, general: "Registration failed. Please try again." });
      }
    }
  };

  const navigate = useNavigate(); // ใช้สำหรับ redirect
    // ฟังก์ชันสำหรับปุ่ม Cancel
    const handleBack = () => {
      navigate(-1); // Redirect ไปยังหน้า Home
    };

  return (
    <div className="flex flex-col items-center min-h-screen py-12">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
      <div className="flex items-center gap-2 text-rose-600 hover:text-rose-500 cursor-pointer"
        onClick={handleBack}
      ><MdOutlineKeyboardBackspace /> Back
      </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">
          Create a new account
        </h1>

        <form onSubmit={handleSubmit}>
          {/* ช่องกรอก username */}
          <div className="mt-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              value={formInput.username}
              onChange={({ target }) => {
                handleInputChange("username", target.value);
              }}
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              className={`mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none ${
                formError.username ? "input-error" : ""
              }`}
            />
            <p className="error-message">{formError.username}</p>
          </div>

          {/* ช่องกรอก first name และ last name */}
          <div className="flex flex-row gap-x-4 mt-6">
            <div className="w-1/2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-900"
              >
                First name
              </label>
              <input
                value={formInput.firstName}
                onChange={({ target }) => {
                  handleInputChange("firstName", target.value);
                }}
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                className={`mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none ${
                  formError.firstName ? "input-error" : ""
                }`}
              />
              <p className="error-message">{formError.firstName}</p>
            </div>

            <div className="w-1/2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-900"
              >
                Last name
              </label>
              <input
                value={formInput.lastName}
                onChange={({ target }) => {
                  handleInputChange("lastName", target.value);
                }}
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                className={`mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none ${
                  formError.lastName ? "input-error" : ""
                }`}
              />
              <p className="error-message">{formError.lastName}</p>
            </div>
          </div>

          {/* ช่องกรอก email */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              value={formInput.email}
              onChange={({ target }) => {
                handleInputChange("email", target.value);
              }}
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              className={`mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none ${
                formError.email ? "input-error" : ""
              }`}
            />
            <p className="error-message">{formError.email}</p>
          </div>

          {/* ช่องกรอก password */}
          <div className="mt-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                value={formInput.password}
                onChange={({ target }) => {
                  handleInputChange("password", target.value);
                }}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none ${
                  formError.password ? "input-error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
              </button>
            </div>
            <p className="error-message">{formError.password}</p>
          </div>

          {/* ช่องกรอก repeat password */}
          <div className="mt-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Repeat password
            </label>
            <div className="relative">
              <input
                value={formInput.repeatPassword}
                onChange={({ target }) => {
                  handleInputChange("repeatPassword", target.value);
                }}
                id="repeatPassword"
                name="repeatPassword"
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat password"
                className={`mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none ${
                  formError.repeatPassword ? "input-error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showRepeatPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
              </button>
            </div>
            <p className="error-message">{formError.repeatPassword}</p>
          </div>

          {/* ปุ่ม Create account */}
          <button
            type="submit"
            className="btn mt-6 w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-500"
          >
            Create account
          </button>

          {/* แสดงข้อความผิดพลาดทั่วไป */}
          {formError.general && (
            <p className="text-red-500 text-sm mt-2 text-center">{formError.general}</p>
          )}
        </form>
        <hr className="border-pink-300 mt-6" />

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-rose-600 hover:text-rose-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;