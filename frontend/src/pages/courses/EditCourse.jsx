import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import propTypes from "prop-types";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const InputField = ({ label, name, type, min, value, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
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
    <span className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </span>
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
          <label
            htmlFor={`${name}-${option}`}
            className="ml-2 text-sm text-gray-700"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

const DatePicker = ({ label, name, value, onChange, min }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
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
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
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
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  // ดึงข้อมูลจาก state ที่ส่งมา
  const { course } = location.state || {};

  const [formDataEdit, setformDataEdit] = useState(() => {
    // ลองดึงข้อมูลที่ถูกเก็บจาก localStorage
    const savedData = localStorage.getItem("formDataEdit");
    if (savedData) {
      return JSON.parse(savedData); // ใช้ข้อมูลที่เก็บไว้
    } else {
      return {
        image_url: course?.image_url || "",
        gym: course?.gym || "",
        courseName: course?.course_name || "",
        level: course?.level || "",
        startDate: course?.start_date || "",
        endDate: course?.end_date || "",
        price: course?.price || "",
        description: course?.description || "",
        activities: course?.activities || [],
      };
    }
  });

  // console.log("99999999999999999999",formDataEdit.activities);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formDataEdit.courseName)
      newErrors.courseName = "Please enter course name.";
    if (!formDataEdit.level) newErrors.level = "Please select a level.";
    if (!formDataEdit.startDate)
      newErrors.startDate = "Please select a start date.";
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
      // Create FormData object for file upload
      const imageCourse = new FormData();

      // Append file if selected
      if (selectedFile) {
        imageCourse.append("course_image", selectedFile);
      }
      console.log("Image data:", selectedFile ? selectedFile.name : "No image");
      
      // บันทึกข้อมูลที่แก้ไขและส่งต่อไป
      localStorage.setItem("formDataEdit", JSON.stringify(formDataEdit));
      // console.log("formDataEdit: ", formDataEdit);
      navigate("/course/editCourseFrom", { state: { formDataEdit, course ,imageCourse:selectedFile} });
    }
  };

  const handleBack = () => {
    localStorage.removeItem("formDataEdit");
    navigate(-1);
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Edit Course
        </h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          {/*  Photo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Course Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 justify-center text-center bg-gray-50">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                id="fileInput"
                accept="image/*"
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-rose-500 rounded-full hover:bg-rose-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-full py-6 hover:bg-gray-100 transition-colors"
                >
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload course photo
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG (recommended size: 800x600px)
                  </p>
                </button>
              )}
            </div>
          </div>

          <InputField
            label="Course Name"
            name="courseName"
            value={formDataEdit.courseName}
            onChange={handleChange}
          />
          {errors.courseName && (
            <p className="text-red-500 text-sm">{errors.courseName}</p>
          )}

          <RadioGroup
            label="Level"
            name="level"
            options={["Forkids", "Beginner", "Advance"]}
            selectedValue={formDataEdit.level || ""}
            onChange={handleChange}
          />
          {errors.level && (
            <p className="text-red-500 text-sm">{errors.level}</p>
          )}

          <DatePicker
            label="Start Date"
            name="startDate"
            value={formDataEdit.startDate}
            onChange={handleChange}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate}</p>
          )}

          <DatePicker
            label="End Date"
            name="endDate"
            value={formDataEdit.endDate}
            min={formDataEdit.startDate}
            onChange={handleChange}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate}</p>
          )}

          <InputField
            label="Price"
            name="price"
            type="number"
            min="0"
            value={formDataEdit.price}
            onChange={handleChange}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}

          <TextArea
            label="Description"
            name="description"
            value={formDataEdit.description}
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
  onChange: propTypes.func.isRequired,
};

RadioGroup.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  options: propTypes.array.isRequired,
  selectedValue: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
};

DatePicker.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  value: propTypes.string,
  onChange: propTypes.func.isRequired,
  min: propTypes.string,
};

TextArea.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  value: propTypes.string,
  onChange: propTypes.func.isRequired,
};
