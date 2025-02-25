import PropTypes from 'prop-types';

const InputField = ({ label, type = "text", name }) => {
  return (
    <div className="mt-4">
      <label className="block text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default InputField;
