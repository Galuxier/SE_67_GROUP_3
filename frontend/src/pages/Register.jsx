import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { registerUser } from "../services/api/AuthApi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import ProfileSetup from "./ProfileSetup";

function RegisterForm() {
  const navigate = useNavigate();
  
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
    general: "",
  });

  const [activeField, setActiveField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus effect for input fields
  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  // Clear error message for the related field
  const clearError = (field) => {
    setFormError((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormInput((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  // Check password strength
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
    
    return {
      score,
      label: labels[score],
      color: colors[score]
    };
  };
  
  const passwordStrength = getPasswordStrength(formInput.password);

  // Validate form inputs
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
    } else if (formInput.username.length < 3) {
      inputError.username = "Username must be at least 3 characters";
    }

    if (!formInput.firstName) {
      inputError.firstName = "Please enter your first name";
    }

    if (!formInput.lastName) {
      inputError.lastName = "Please enter your last name";
    }

    if (!formInput.email) {
      inputError.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(formInput.email)) {
      inputError.email = "Please enter a valid email address";
    }

    // if (!formInput.password) {
    //   inputError.password = "Please enter your password";
    // } else if (formInput.password.length < 8) {
    //   inputError.password = "Password must be at least 8 characters";
    // } else if (passwordStrength.score < 3) {
    //   inputError.password = "Password is too weak. Add numbers, symbols, or uppercase letters";
    // }

    if (!formInput.repeatPassword) {
      inputError.repeatPassword = "Please confirm your password";
    } else if (formInput.password !== formInput.repeatPassword) {
      inputError.repeatPassword = "Passwords don't match!";
    }

    setFormError(inputError);

    // Check if there are any errors
    return !Object.values(inputError).some((error) => error !== "");
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear all error messages
    setFormError({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      general: "",
    });

    // Validate form
    const isValid = validateFormInput(event);
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    // Send data to API
    try {
      const userData = {
        username: formInput.username,
        first_name: formInput.firstName,
        last_name: formInput.lastName,
        email: formInput.email,
        password: formInput.password,
      };

      const { user } = await registerUser(userData);
      
      // Show success toast
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Store registered user for profile setup
      setRegisteredUser(user);
      console.log(registerUser);
      setRegistrationSuccess(true);
      
      // Clear form
      setFormInput({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
      });
      
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.message === "Email already exists") {
        setFormError({ ...formError, email: "Email already exists", general: "" });
      } else if (error.message === "Username already exists") {
        setFormError({ ...formError, username: "Username already exists", general: "" });
      } else {
        setFormError({ ...formError, general: "Registration failed. Please try again." });
        
        // Show error toast
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // If registration is successful, show the ProfileSetup component
  if (registrationSuccess) {
    return <ProfileSetup user={registeredUser} />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ToastContainer />

      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-indigo-500/30 backdrop-blur-sm z-10"></div>
        <div className="w-full h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${new URL("../assets/images/background-001.jpg", import.meta.url).href})` }}>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
            <h1 className="text-5xl font-bold text-white mb-4">Muay Thai</h1>
            <p className="text-xl text-white/90 text-center max-w-md">
              เข้าร่วมเป็นส่วนหนึ่งของชุมชนมวยไทย ศิลปะการต่อสู้ที่ทรงเกียรติที่สุดในประเทศไทย
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white shadow-xl rounded-2xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-rose-600 to-rose-500 py-5 px-6 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">Create Account</h2>
              <p className="text-white/80 mt-2">Join our Muay Thai community</p>
            </motion.div>

            <div className="p-6 md:p-8">
              <motion.div 
                variants={itemVariants} 
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer mb-6"
                onClick={handleBack}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back</span>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username field */}
                  <div className="relative md:col-span-2">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      formError.username ? 'text-red-500' : activeField === 'username' ? 'text-rose-600' : 'text-gray-400'
                    }`}>
                      <FiUser />
                    </div>
                    <input
                      value={formInput.username}
                      onChange={({ target }) => handleInputChange("username", target.value)}
                      onFocus={() => handleFocus("username")}
                      onBlur={handleBlur}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Username"
                      className={`pl-10 py-3 px-4 block w-full rounded-lg text-sm border ${
                        formError.username 
                          ? 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' 
                          : activeField === 'username'
                            ? 'border-rose-600 focus:ring-rose-600 focus:border-rose-600'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600'
                      } bg-transparent dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    {formError.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formError.username}</p>
                    )}
                  </div>

                  {/* First name field */}
                  <div className="relative">
                    <input
                      value={formInput.firstName}
                      onChange={({ target }) => handleInputChange("firstName", target.value)}
                      onFocus={() => handleFocus("firstName")}
                      onBlur={handleBlur}
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      className={`py-3 px-4 block w-full rounded-lg text-sm border ${
                        formError.firstName 
                          ? 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' 
                          : activeField === 'firstName'
                            ? 'border-rose-600 focus:ring-rose-600 focus:border-rose-600'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600'
                      } bg-transparent dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    {formError.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formError.firstName}</p>
                    )}
                  </div>

                  {/* Last name field */}
                  <div className="relative">
                    <input
                      value={formInput.lastName}
                      onChange={({ target }) => handleInputChange("lastName", target.value)}
                      onFocus={() => handleFocus("lastName")}
                      onBlur={handleBlur}
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      className={`py-3 px-4 block w-full rounded-lg text-sm border ${
                        formError.lastName 
                          ? 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' 
                          : activeField === 'lastName'
                            ? 'border-rose-600 focus:ring-rose-600 focus:border-rose-600'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600'
                      } bg-transparent dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    {formError.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formError.lastName}</p>
                    )}
                  </div>
                </motion.div>

                {/* Email field */}
                <motion.div variants={itemVariants} className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                    formError.email ? 'text-red-500' : activeField === 'email' ? 'text-rose-600' : 'text-gray-400'
                  }`}>
                    <FiMail />
                  </div>
                  <input
                    value={formInput.email}
                    onChange={({ target }) => handleInputChange("email", target.value)}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className={`pl-10 py-3 px-4 block w-full rounded-lg text-sm border ${
                      formError.email 
                        ? 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' 
                        : activeField === 'email'
                          ? 'border-rose-600 focus:ring-rose-600 focus:border-rose-600'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600'
                    } bg-transparent dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                  {formError.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formError.email}</p>
                  )}
                </motion.div>

                {/* Password field */}
                <motion.div variants={itemVariants}>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      formError.password ? 'text-red-500' : activeField === 'password' ? 'text-rose-600' : 'text-gray-400'
                    }`}>
                      <FiLock />
                    </div>
                    <input
                      value={formInput.password}
                      onChange={({ target }) => handleInputChange("password", target.value)}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`pl-10 py-3 px-4 block w-full rounded-lg text-sm border ${
                        formError.password 
                          ? 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' 
                          : activeField === 'password'
                            ? 'border-rose-600 focus:ring-rose-600 focus:border-rose-600'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600'
                      } bg-transparent dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                    </button>
                  </div>
                  
                  {formInput.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1 mb-1 h-1">
                        <div className={`h-full rounded-full w-1/5 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}></div>
                        <div className={`h-full rounded-full w-1/5 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}></div>
                        <div className={`h-full rounded-full w-1/5 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}></div>
                        <div className={`h-full rounded-full w-1/5 ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}></div>
                        <div className={`h-full rounded-full w-1/5 ${passwordStrength.score >= 5 ? passwordStrength.color : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}></div>
                      </div>
                      <div className="flex justify-between">
                        <p className={`text-xs ${passwordStrength.score >= 3 ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {passwordStrength.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formInput.password.length < 8 ? `${8 - formInput.password.length} more characters needed` : ""}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {formError.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formError.password}</p>
                  )}
                </motion.div>

                {/* Repeat password field */}
                <motion.div variants={itemVariants} className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                    formError.repeatPassword ? 'text-red-500' : activeField === 'repeatPassword' ? 'text-rose-600' : 'text-gray-400'
                  }`}>
                    <FiLock />
                  </div>
                  <input
                    value={formInput.repeatPassword}
                    onChange={({ target }) => handleInputChange("repeatPassword", target.value)}
                    onFocus={() => handleFocus("repeatPassword")}
                    onBlur={handleBlur}
                    id="repeatPassword"
                    name="repeatPassword"
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className={`pl-10 py-3 px-4 block w-full rounded-lg text-sm border ${
                      formError.repeatPassword 
                        ? 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500' 
                        : activeField === 'repeatPassword'
                          ? 'border-rose-600 focus:ring-rose-600 focus:border-rose-600'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600'
                    } bg-transparent dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showRepeatPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                  </button>
                  {formError.repeatPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formError.repeatPassword}</p>
                  )}
                </motion.div>

                {/* General error message */}
                {formError.general && (
                  <motion.div 
                    variants={itemVariants}
                    className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" 
                    role="alert"
                  >
                    {formError.general}
                  </motion.div>
                )}

                {/* Create account button */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-white font-medium bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <ClipLoader size={20} color="#ffffff" />
                      <span className="ml-2">Creating account...</span>
                    </div>
                  ) : (
                    "Create account"
                  )}
                </motion.button>
              </form>

              <motion.div 
                variants={itemVariants}
                className="mt-6 text-center"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account?</span>
                <Link to="/login" className="ml-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400">
                  Log in
                </Link>
              </motion.div>

              {/* <motion.div 
                variants={itemVariants}
                className="mt-6 flex items-center justify-center space-x-4"
              >
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterForm;