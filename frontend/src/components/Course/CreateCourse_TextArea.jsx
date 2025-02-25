import PropTypes from "prop-types";

const TextArea = ({ label, name }) => {
  // console.log("TextArea Props:", { label, name });

  return (
    <div className="mt-4">
      <label className="block text-gray-600">{label}</label>
      <textarea
        name={name}
        className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
  );
};

// PropTypes validation for props
TextArea.propTypes = {
  label: PropTypes.string.isRequired, // label should be a string and required
  name: PropTypes.string.isRequired,  // name should be a string and required
};

export default TextArea;
