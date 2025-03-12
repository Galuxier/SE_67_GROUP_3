import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
      <ClipLoader className="dark:text-white text-gray-600" color="currentColor" size={50} />
      <p className="ml-2 text-gray-600 dark:text-white">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;