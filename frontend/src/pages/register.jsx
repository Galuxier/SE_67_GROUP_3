import { useState } from "react";
import { api } from '../services/api';
 
import "../index.css";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

function RegisterForm() {
  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [formError, setFormError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const validateFormInput = (event) => {
    event.preventDefault();

    let inputError = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
    };

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
      inputError.repeatPassword = "Please enter confirm your password";
    }
    if (formInput.password !== formInput.repeatPassword) {
      inputError.repeatPassword = "Password don't match!";
    }
    setFormError(inputError);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen py-12">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Create a new account
        </h1>

        <form onSubmit={validateFormInput}>
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
                  setFormInput({ ...formInput, firstName: target.value });
                }}
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
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
                  setFormInput({ ...formInput, lastName: target.value });
                }}
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
              />
              <p className="error-message">{formError.lastName}</p>
            </div>
          </div>

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
                setFormInput({ ...formInput, email: target.value });
              }}
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
            />
            <p className="error-message">{formError.email}</p>
          </div>

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
                    setFormInput({ ...formInput, password: target.value });
                }}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                {showPassword ? (
                    <IoMdEyeOff size={20} />
                ) : (
                    <IoMdEye size={20} />
                )}
                </button>
            </div>
            <p className="error-message">{formError.password}</p>
          </div>

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
                setFormInput({ ...formInput, repeatPassword: target.value });
              }}
              id="repeatPassword"
              name="repeatPassword"
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repeat password"
              className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showRepeatPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />} {/* แก้ไอคอนให้เปลี่ยนได้ */}
            </button>
            </div>
            <p className="error-message">{formError.repeatPassword}</p>
          </div>
          <button
            type="submit"
            className="btn mt-6 w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-500"
          >
            Create account
          </button>
        </form>
        <hr className="border-pink-300 mt-6" />

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="#" className="text-rose-600 hover:text-rose-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;