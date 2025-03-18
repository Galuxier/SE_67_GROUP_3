import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api/AuthApi";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

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
  const [isLoggingIn, setIsLoggingIn] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ Login
  const [roles, setRoles] = useState([]);

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
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setFormError({
      identifier: "",
      password: "",
    });
  
    if (!formInput.identifier || !formInput.password) {
      setFormError({
        identifier: !formInput.identifier ? "Please enter your email or username" : "",
        password: !formInput.password ? "Please enter your password" : "",
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

      toast.success("Registration successful!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      localStorage.setItem("token", token);
  
      // 👉 เซ็ต roles ใน state เพื่อให้ useEffect สามารถเข้าถึงได้
      const userRoles = await login(token);
      setRoles(userRoles);
  
      if (userRoles.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Login failed", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsLoggingIn(false), 100);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-background text-text">
      <ToastContainer />
      <div className="w-96 p-6 shadow-lg bg-background rounded-md border border-border">
        {isCheckingAuth ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="primary" />
          </div>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="text-secondary hover:text-primary mb-4"
            >
              ← Back
            </button>

            <h1 className="text-3xl block text-center font-semibold py-2 text-text">
              Login
            </h1>

            <form onSubmit={handleSubmit}>
              {/* ช่องกรอก email/username */}
              <div className="mb-4">
                <label htmlFor="identifier" className="block text-sm font-medium text-text mb-1">
                  Username/E-mail
                </label>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formInput.identifier}
                  onChange={handleInputChange}
                  className={`w-full border rounded py-2 px-3 focus:outline-none focus:border-primary ${
                    formError.identifier ? "border-secondary" : "border-border"
                  } bg-background text-text`}
                  placeholder="Enter your email or username"
                />
                {formError.identifier && (
                  <p className="text-secondary text-sm mt-1">{formError.identifier}</p>
                )}
              </div>

              {/* ช่องกรอก password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formInput.password}
                  onChange={handleInputChange}
                  className={`w-full border rounded py-2 px-3 focus:outline-none focus:border-primary ${
                    formError.password ? "border-secondary" : "border-border"
                  } bg-background text-text`}
                  placeholder="Enter your password"
                />
                {formError.password && (
                  <p className="text-secondary text-sm mt-1">{formError.password}</p>
                )}
              </div>

              {/* ปุ่ม Login */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn mt-6 w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ClipLoader size={20} color="#ffffff" />
                  ) : (
                    <span className="text-white">LOGIN</span>
                  )}
                </button>
              </div>
            </form>

            <div>
              <Link
                to="/signup"
                className="block text-center py-2 text-secondary hover:text-primary"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;