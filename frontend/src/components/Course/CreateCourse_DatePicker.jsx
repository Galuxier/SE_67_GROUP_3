import PropTypes from 'prop-types';

const DatePicker = ({ label, name }) => {
  return (
    <div className="mt-4">
      <label className="block text-gray-600">{label}</label>
      <input
        type="date"
        name={name}
        className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default DatePicker;
