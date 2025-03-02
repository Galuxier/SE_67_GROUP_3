import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const InputField = ({ label, name, type, min, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        min={min}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  min: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

InputField.defaultProps = {
  type: "text",
  min: "",
};

const RadioGroup = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div className="mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="flex space-x-4">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`${name}-${option}`} className="ml-2 text-sm text-gray-700">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DatePicker = ({ label, name, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const TextArea = ({ label, name, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows="4"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const SubmitButton = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
    >
      {text}
    </button>
  );
};

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default function CreateCourse() {
  const navigate = useNavigate();

  // State to hold form values
  const [formData, setFormData] = useState({
    courseName: "",
    level: "",
    startDate: "",
    endDate: "",
    price: "",
    details: "",
  });

  // Validate function
  const validateForm = () => {
    const { courseName, level, startDate, endDate, price } = formData;
    if (!courseName || !level || !startDate || !endDate || !price) {
      alert("Please fill all fields");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Save form data to sessionStorage or localStorage
      localStorage.setItem("courseData", JSON.stringify(formData));
      // Navigate to the next page
      // console.log("In First Page: ", formData);
      navigate("/course/courseFrom", { state: { formData } });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Create a Course</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <InputField
            label="Course Name"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
          />
          <RadioGroup
            label="Level"
            name="level"
            options={["For Kids", "Beginner", "Advance"]}
            selectedValue={formData.level}
            onChange={handleChange}
          />
          <DatePicker
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <DatePicker
            label="End Date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <InputField
            label="Price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
          />
          <TextArea
            label="Details"
            name="details"
            value={formData.details}
            onChange={handleChange}
          />
          <SubmitButton text="Next" />
        </form>
      </div>
    </div>
  );
}
