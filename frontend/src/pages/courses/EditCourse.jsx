import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import propTypes from "prop-types";


const InputField = ({ label, name, type, min, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type || "text"}
      id={name}
      name={name}
      min={min}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const RadioGroup = ({ label, name, options, selectedValue, onChange }) => (
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

const DatePicker = ({ label, name, value, onChange, min }) => (
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
      min={min}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
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
    />
  </div>
);

export default function EditCourse() {
  const location = useLocation();
  const navigate = useNavigate();

  // ดึงข้อมูลจาก state ที่ส่งมา
  const { course } = location.state || {};
  
  const [formDataEdit, setformDataEdit] = useState(() => {
    // ลองดึงข้อมูลที่ถูกเก็บจาก localStorage
    const savedData = localStorage.getItem("formDataEdit");
    if (savedData) {
      return JSON.parse(savedData);  // ใช้ข้อมูลที่เก็บไว้
    } else {
      return {
        image_url: course?.image_url || "",
        gym: course?.gym || "",
        courseName: course?.course_name || "",
        level: course?.level || "",
        startDate: course?.start_date || "",
        endDate: course?.end_date || "",
        price: course?.price || "",
        details: course?.description || "",
        Activity: course?.Activity || "",
      };
    }
  });
  

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formDataEdit.courseName) newErrors.courseName = "Please enter course name.";
    if (!formDataEdit.level) newErrors.level = "Please select a level.";
    if (!formDataEdit.startDate) newErrors.startDate = "Please select a start date.";
    if (!formDataEdit.endDate) newErrors.endDate = "Please select an end date.";
    if (!formDataEdit.price) newErrors.price = "Please enter the price.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformDataEdit({ ...formDataEdit, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // บันทึกข้อมูลที่แก้ไขและส่งต่อไป
      localStorage.setItem("formDataEdit", JSON.stringify(formDataEdit));
      console.log("formDataEdit: ", formDataEdit);
      navigate("/course/editCourseFrom", { state: { formDataEdit ,course} });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Edit Course</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <InputField 
            label="Course Name" 
            name="courseName" 
            value={formDataEdit.courseName} 
            onChange={handleChange} 
          />
          {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName}</p>}

          <RadioGroup
            label="Level"
            name="level"
            options={["For Kids", "Beginner", "Advance"]}
            selectedValue={formDataEdit.level || ""}
            onChange={handleChange}
          />
          {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}

          <DatePicker 
            label="Start Date" 
            name="startDate" 
            value={formDataEdit.startDate} 
            onChange={handleChange} 
            // min={new Date().toISOString().split("T")[0]}
            // min={formDataEdit.startDate} 
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}

          <DatePicker 
            label="End Date" 
            name="endDate" 
            value={formDataEdit.endDate} 
            min={formDataEdit.startDate} 
            onChange={handleChange} 
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}

          <InputField 
            label="Price" 
            name="price" 
            type="number" 
            min="0" 
            value={formDataEdit.price} 
            onChange={handleChange} 
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

          <TextArea 
            label="Details" 
            name="details" 
            value={formDataEdit.details} 
            onChange={handleChange} 
          />

          <div className="flex justify-between gap-3 mt-6">
            <button 
              type="button" 
              onClick={handleBack} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
            >
              Back
            </button>
            <button 
              type="submit"
              className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InputField.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  type: propTypes.string,
  min: propTypes.string,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onChange: propTypes.func.isRequired
};

RadioGroup.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  options: propTypes.array.isRequired,
  selectedValue: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired
};

DatePicker.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  value: propTypes.string,
  onChange: propTypes.func.isRequired,
  min: propTypes.string
};

TextArea.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  value: propTypes.string,
  onChange: propTypes.func.isRequired
};
