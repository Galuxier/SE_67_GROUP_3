const TextArea = ({ label, name }) => {
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
  
  export default TextArea;
  