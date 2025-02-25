import PropTypes from "prop-types";

const SubmitButton = ({ text }) => {
  return (
    <button className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-lg transition-all">
      {text || "ส่งข้อมูล"}
    </button>
  );
};

SubmitButton.propTypes = {
  text: PropTypes.string, // text should be a string
};

export default SubmitButton;
