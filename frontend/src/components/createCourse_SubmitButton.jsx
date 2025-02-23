const SubmitButton = ({ text }) => {
    return (
      <button className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-all">
        {text}
      </button>
    );
  };
  
  export default SubmitButton;
  