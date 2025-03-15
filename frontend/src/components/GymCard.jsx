import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function GymCard({ gyms }) {
  const navigate = useNavigate();

  const handleGymClick = (gym) => {
    console.log("Navigating to:", `/gym/detail/${gym._id}`);
    navigate(`/gym/detail/${gym._id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {gyms.map((gym) => (
        <GymCardItem key={gym._id} gym={gym} onClick={() => handleGymClick(gym)} />
      ))}
    </div>
  );
}

const GymCardItem = ({ gym, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // เปลี่ยนรูปทุกๆ 2 วินาทีเมื่อเมาส์ชี้
  useEffect(() => {
    let interval;
    if (isHovered && gym.gym_image_url?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === gym.gym_image_url.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000); // เปลี่ยนรูปทุก 2 วินาที
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, gym.gym_image_url]);

  return (
    <button
      className={`max-w-xs rounded-lg overflow-hidden bg-card text-text cursor-pointer transition transform hover:scale-105 
                  shadow-xl hover:shadow-2xl border border-opacity-10 border-gray-300 dark:border-gray-600`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full aspect-[4/3] relative">
        {gym.gym_image_url?.map((image, index) => (
          <img
            key={index}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            src={`http://10.35.145.93:3000/images/${image}`}
            alt={`Gym Image ${index}`}
          />
        ))}
      </div>
      <div className="px-6 py-4">
        {/* Gym Name */}
        <div className="text-base mb-3 text-text font-semibold">
          {gym.gym_name}
        </div>
  
        {/* Address */}
        <div className="flex items-center font-base text-lg mb-2">
          <span className="mr-2">
            <FaMapMarkerAlt className="text-text" />
          </span>
          <span className="text-base mr-1 text-text">
            {gym.address?.district || "-"} ,
          </span>
          <span className="text-base text-text">
            {gym.address?.province || "-"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default GymCard;
