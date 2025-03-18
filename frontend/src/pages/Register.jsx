import { useState } from "react";
import "../index.css";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { registerUser } from "../services/api/AuthApi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ProfileSetup from "./ProfileSetup";
import { toast } from "react-toastify";

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
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Clear error message for the related field
  const clearError = (field) => {
    setFormError((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormInput((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

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
    }
    if (!formInput.repeatPassword) {
      inputError.repeatPassword = "Please confirm your password";
    }
    if (formInput.password !== formInput.repeatPassword) {
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
      console.log("Registration successful:", response);
      
      // Show success toast
      toast.success("Registration successful!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
    <div className="flex flex-col items-center min-h-screen py-12 bg-background">
      <div className="bg-card p-6 rounded-lg shadow-md max-w-lg w-full border border-border">
        <div 
          className="flex items-center gap-2 text-primary hover:text-secondary cursor-pointer mb-6"
          onClick={handleBack}
        >
          <MdOutlineKeyboardBackspace /> Back
        </div>

        <h1 className="text-center text-2xl font-bold text-text mb-6">
          Create a new account
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Username field */}
          <div className="mt-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text"
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
              className={`mt-1 py-1 px-3 block w-full rounded-md border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text ${
                formError.username ? "border-secondary" : "border-border"
              }`}
            />
            <p className="text-secondary text-sm mt-1">{formError.username}</p>
          </div>

          {/* First name and last name fields */}
          <div className="flex flex-row gap-x-4 mt-6">
            <div className="w-1/2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-text"
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
                className={`mt-1 py-1 px-3 block w-full rounded-md border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text ${
                  formError.firstName ? "border-secondary" : "border-border"
                }`}
              />
              <p className="text-secondary text-sm mt-1">{formError.firstName}</p>
            </div>

            <div className="w-1/2">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-text"
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
                className={`mt-1 py-1 px-3 block w-full rounded-md border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text ${
                  formError.lastName ? "border-secondary" : "border-border"
                }`}
              />
              <p className="text-secondary text-sm mt-1">{formError.lastName}</p>
            </div>
          </div>

          {/* Email field */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text"
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
              className={`mt-1 py-1 px-3 block w-full rounded-md border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text ${
                formError.email ? "border-secondary" : "border-border"
              }`}
            />
            <p className="text-secondary text-sm mt-1">{formError.email}</p>
          </div>

          {/* Password field */}
          <div className="mt-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text"
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
                className={`mt-1 py-1 px-3 block w-full rounded-md border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text ${
                  formError.password ? "border-secondary" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text"
              >
                {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
              </button>
            </div>
            <p className="text-secondary text-sm mt-1">{formError.password}</p>
          </div>

          {/* Repeat password field */}
          <div className="mt-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text"
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
                className={`mt-1 py-1 px-3 block w-full rounded-md border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text ${
                  formError.repeatPassword ? "border-secondary" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text"
              >
                {showRepeatPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
              </button>
            </div>
            <p className="text-secondary text-sm mt-1">{formError.repeatPassword}</p>
          </div>

          {/* Create account button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition-colors duration-300"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {/* General error message */}
          {formError.general && (
            <p className="text-secondary text-sm mt-2 text-center">{formError.general}</p>
          )}
        </form>
        <hr className="border-border mt-6" />

        <p className="mt-4 text-center text-sm text-text">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:text-secondary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;