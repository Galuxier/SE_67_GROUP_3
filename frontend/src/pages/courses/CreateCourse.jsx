import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const InputField = ({ label, name, type, min }) => {
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
};

InputField.defaultProps = {
  type: "text",
  min: "",
};

const RadioGroup = ({ label, name, options }) => {
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
};

const DatePicker = ({ label, name }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const TextArea = ({ label, name }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows="4"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
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
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Register for a course</h2>
        <form className="mt-4">
          <InputField label="name course" name="courseName" />
          <RadioGroup label="level" name="level" options={["For Kids", "Beginner", "Advance"]} />
          <DatePicker label="start date of course" name="startDate" />
          <DatePicker label="end date of course" name="endDate" />
          <InputField label="price" name="price" type="number" min="0" />
          <TextArea label="detail" name="details" />
          <Link to ="/course/courseFrom">
          <SubmitButton text="next" />
          </Link>
        </form>
      </div>
    </div>
  );
}
