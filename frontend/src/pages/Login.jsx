import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api/AuthApi";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const [formInput, setFormInput] = useState({
    identifier: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    identifier: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn && !isLoggingIn) {
      toast.info("คุณล็อกอินอยู่แล้ว", {
        position: "top-right",
        autoClose: 2000,
      });
      if (roles.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [isLoggedIn, navigate, isLoggingIn, roles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (formError[name]) {
      setFormError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setFormError({
      identifier: "",
      password: "",
    });
  
    if (!formInput.identifier || !formInput.password) {
      setFormError({
        identifier: !formInput.identifier ? "กรุณากรอกอีเมลหรือชื่อผู้ใช้" : "",
        password: !formInput.password ? "กรุณากรอกรหัสผ่าน" : "",
      });
      return;
    }
  
    setIsLoading(true);
    setIsLoggingIn(true);
  
    try {
      const { token } = await loginUser({
        identifier: formInput.identifier,
        password: formInput.password,
      });
  
      if (!token) throw new Error("Invalid response from server");

      toast.success("เข้าสู่ระบบสำเร็จ!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      localStorage.setItem("token", token);
  
      // Set roles in state to allow useEffect to access
      const userRoles = await login(token);
      setRoles(userRoles);
  
      if (userRoles.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "เข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsLoggingIn(false), 100);
    }
  };

  const handleBack = () => navigate(-1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.2, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />
      
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-indigo-500/30 backdrop-blur-sm z-10"></div>
        <div className="w-full h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${new URL("../assets/images/muaythai-001.jpg", import.meta.url).href})` }}>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
            <h1 className="text-5xl font-bold text-white mb-4">Muay Thai</h1>
            <p className="text-xl text-white/90 text-center max-w-md">
              เข้าสู่โลกของมวยไทย ศิลปะการต่อสู้ที่ทรงเกียรติที่สุดในประเทศไทย
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        {isCheckingAuth ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="#E11D48" />
          </div>
        ) : (
          <motion.div 
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white shadow-xl rounded-2xl p-8 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    ← กลับ
                  </button>
                  
                  <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                    เข้าสู่ระบบ
                  </h2>
                  
                  <div className="w-8"></div> {/* Spacer for centering */}
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ชื่อผู้ใช้หรืออีเมล
                  </label>
                  <div className={`relative rounded-md border ${formError.identifier ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-600'} focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden`}>
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={formInput.identifier}
                      onChange={handleInputChange}
                      className="block w-full border-0 bg-transparent py-3 px-4 focus:outline-none focus:ring-0 dark:text-white text-base"
                      placeholder="ใส่ชื่อผู้ใช้หรืออีเมล"
                    />
                  </div>
                  {formError.identifier && (
                    <p className="mt-1 text-sm text-red-500">{formError.identifier}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    รหัสผ่าน
                  </label>
                  <div className={`relative rounded-md border ${formError.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 dark:border-gray-600'} focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formInput.password}
                      onChange={handleInputChange}
                      className="block w-full border-0 bg-transparent py-3 px-4 focus:outline-none focus:ring-0 dark:text-white text-base pr-10"
                      placeholder="ใส่รหัสผ่าน"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoMdEyeOff className="h-5 w-5" />
                      ) : (
                        <IoMdEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formError.password && (
                    <p className="mt-1 text-sm text-red-500">{formError.password}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      จดจำฉัน
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-secondary">
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <ClipLoader size={24} color="#ffffff" />
                    ) : (
                      "เข้าสู่ระบบ"
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  ยังไม่มีบัญชีใช่ไหม?{" "}
                  <Link to="/signup" className="font-medium text-primary hover:text-secondary">
                    สมัครสมาชิก
                  </Link>
                </p>
              </motion.div>

              {/* <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center space-x-6">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4267B2] hover:bg-[#3b5998] text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.677 20.895v-7.745H7V10.04h2.677V7.585c0-2.668 1.621-4.12 3.998-4.12 1.138 0 2.116.086 2.4.124v2.821h-1.646c-1.291 0-1.54.617-1.54 1.521v1.993h3.064l-.399 3.11h-2.665v7.852"></path>
                  </svg>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] hover:bg-[#0d95e8] text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#DB4437] hover:bg-[#c53929] text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path>
                  </svg>
                </button>
              </motion.div> */}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Login;