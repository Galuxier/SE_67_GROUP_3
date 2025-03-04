function Button({ children, onClick, variant = "primary" }) {
    const baseStyle = "px-4 py-2 rounded-md font-medium focus:outline-none";
    const styles = {
      primary: "bg-rose-600 text-white hover:bg-rose-700 ml-2",
      secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    };
  
    return (
      <button className={`${baseStyle} ${styles[variant]}`} onClick={onClick}>
        {children}
      </button>
    );
  }
  
  export default Button;