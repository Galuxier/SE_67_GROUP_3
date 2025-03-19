import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { registerUser } from "../services/api/AuthApi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
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
  const [currentStep, setCurrentStep] = useState(1);

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

    if (!formInput.password) {
      inputError.password = "Please enter your password";
    } else if (formInput.password.length < 8) {
      inputError.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score < 3) {
      inputError.password = "Password is too weak. Add numbers, symbols, or uppercase letters";
    }

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

      const response = await registerUser(userData);
      
      // Show success toast
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Store registered user for profile setup
      setRegisteredUser(response);
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

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-2xl rounded-2xl overflow-hidden border border-border animate-fadeIn">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white">
            <div className="flex justify-center mb-4">
              <div className="mx-auto relative">
                <div className="text-3xl font-bold text-white text-center mb-2">Create Account</div>
                <p className="text-white/80 text-center">Join our Muay Thai community</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div 
              className="flex items-center gap-2 text-primary hover:text-secondary cursor-pointer mb-6"
              onClick={handleBack}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="relative">
                <div className={`flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ${
                  formError.username ? 'text-red-500' : activeField === 'username' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
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
                        ? 'border-primary focus:ring-primary focus:border-primary'
                        : 'border-border focus:ring-primary focus:border-primary'
                  } bg-background text-text focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                {formError.username && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formError.username}</p>
                )}
              </div>

              {/* First name and last name fields */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
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
                          ? 'border-primary focus:ring-primary focus:border-primary'
                          : 'border-border focus:ring-primary focus:border-primary'
                    } bg-background text-text focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                  {formError.firstName && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formError.firstName}</p>
                  )}
                </div>

                <div className="flex-1">
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
                          ? 'border-primary focus:ring-primary focus:border-primary'
                          : 'border-border focus:ring-primary focus:border-primary'
                    } bg-background text-text focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                  {formError.lastName && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formError.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div className="relative">
                <div className={`flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ${
                  formError.email ? 'text-red-500' : activeField === 'email' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
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
                        ? 'border-primary focus:ring-primary focus:border-primary'
                        : 'border-border focus:ring-primary focus:border-primary'
                  } bg-background text-text focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                {formError.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formError.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="relative">
                  <div className={`flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ${
                    formError.password ? 'text-red-500' : activeField === 'password' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
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
                          ? 'border-primary focus:ring-primary focus:border-primary'
                          : 'border-border focus:ring-primary focus:border-primary'
                    } bg-background text-text focus:outline-none focus:ring-2 transition-all duration-200`}
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
                    <div className="flex space-x-2 mb-1 h-1">
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
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formError.password}</p>
                )}
              </div>

              {/* Repeat password field */}
              <div className="relative">
                <div className={`flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ${
                  formError.repeatPassword ? 'text-red-500' : activeField === 'repeatPassword' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
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
                        ? 'border-primary focus:ring-primary focus:border-primary'
                        : 'border-border focus:ring-primary focus:border-primary'
                  } bg-background text-text focus:outline-none focus:ring-2 transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showRepeatPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                </button>
                {formError.repeatPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formError.repeatPassword}</p>
                )}
              </div>

              {/* Create account button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-white font-medium bg-primary hover:bg-secondary rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={20} color="#ffffff" />
                    <span className="ml-2">Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </button>

              {/* General error message */}
              {formError.general && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                  {formError.general}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-text/70">Already have an account?</span>
              <Link to="/login" className="ml-1.5 text-sm font-medium text-primary hover:text-secondary">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;