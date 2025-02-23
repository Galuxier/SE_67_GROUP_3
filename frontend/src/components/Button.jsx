import React from "react";
const Button = ({ text, variant, onClick }) => {
    let baseStyle = "px-6 py-2 rounded-lg font-semibold transition-all";
    let colorStyle = "";
  
    switch (variant) {
      case "primary":
        colorStyle = "bg-blue-600 text-white hover:bg-blue-700";
        break;
      case "secondary":
        colorStyle = "bg-gray-300 text-gray-700 hover:bg-gray-400";
        break;
      case "orange":
        colorStyle = "bg-orange-500 text-white hover:bg-orange-600"; // สีส้ม
        break;
      default:
        colorStyle = "bg-gray-300 text-gray-700 hover:bg-gray-400";
    }
  
    return (
      <button onClick={onClick} className={`${baseStyle} ${colorStyle}`}>
        {text}
      </button>
    );
  };
  
  export default Button;
  
  