import PropTypes from 'prop-types';

const RadioGroup = ({ label, name, options }) => {
  return (
    <div className="mt-4">
      <label className="block text-gray-600">{label}</label>
      <div className="flex gap-3 mt-1">
        {options.map((option, index) => (
          <label key={index} className="flex items-center">
            <input type="radio" name={name} className="text-blue-500" />
            <span className="ml-2 text-gray-700">{option}</span>
          </label>
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

export default RadioGroup;
