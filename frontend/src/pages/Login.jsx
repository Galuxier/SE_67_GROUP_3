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

  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      toast.info("คุณล็อกอินอยู่แล้ว", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
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

    try {
      const { token } = await loginUser({
        identifier: formInput.identifier,
        password: formInput.password,
      });

      if (!token) throw new Error("Invalid response from server");

      localStorage.setItem("token", token);
      login(token);

      toast.success("Login สำเร็จ!", {
        position: "top-right",
        autoClose: 1000,
      });

      navigate(-1);
    } catch (error) {
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
      <div className="w-96 p-6 shadow-lg bg-white dark:bg-gray-800 rounded-md">
        {isCheckingAuth ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} color="#4F46E5" />
          </div>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
            >
              ← Back
            </button>

            <h1 className="text-3xl block text-center font-semibold py-2 text-gray-800 dark:text-gray-100">
              Login
            </h1>

            <form onSubmit={handleSubmit}>
              {/* ช่องกรอก email/username */}
              <div className="mb-4">
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username/E-mail
                </label>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formInput.identifier}
                  onChange={handleInputChange}
                  className={`w-full border rounded py-2 px-3 focus:outline-none focus:border-pink-500 ${
                    formError.identifier ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Enter your email or username"
                />
                {formError.identifier && (
                  <p className="text-red-500 text-sm mt-1">{formError.identifier}</p>
                )}
              </div>

              {/* ช่องกรอก password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formInput.password}
                  onChange={handleInputChange}
                  className={`w-full border rounded py-2 px-3 focus:outline-none focus:border-pink-500 ${
                    formError.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  } bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="Enter your password"
                />
                {formError.password && (
                  <p className="text-red-500 text-sm mt-1">{formError.password}</p>
                )}
              </div>

              {/* ปุ่ม Login */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full bg-rose-600 border rounded py-2 px-3 focus:outline-none flex items-center justify-center"
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
                className="block text-center py-2 text-rose-600 dark:text-rose-400 hover:text-rose-500"
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
