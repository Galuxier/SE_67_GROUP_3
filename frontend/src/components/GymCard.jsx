/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getImage } from "../services/api/ImageApi";

function GymCard({ gyms }) {
  const navigate = useNavigate();

  const handleGymClick = (gym) => {
    console.log("Navigating to:", `/gym/detail/${gym._id}`);
    navigate(`/gym/detail/${gym._id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"> {/* ปรับ grid-cols และ gap */}
      {gyms.map((gym) => (
        <GymCardItem key={gym._id} gym={gym} onClick={() => handleGymClick(gym)} />
      ))}
    </div>
  );
}

const GymCardItem = ({ gym, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (gym.gym_image_url?.length > 0) {
        const urls = await Promise.all(
          gym.gym_image_url.map(async (imageUrl) => {
            return await getImage(imageUrl);
          })
        );
        setImageUrls(urls);
      }
    };
    fetchImages();
  }, [gym.gym_image_url]);

  useEffect(() => {
    let interval;
    if (isHovered && imageUrls.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, imageUrls]);

  return (
    <button
      className={`max-w-xs rounded-lg overflow-hidden bg-card text-text cursor-pointer transition transform hover:scale-105 
                  shadow-xl hover:shadow-2xl border border-opacity-10 border-gray-300 dark:border-gray-600`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full aspect-[4/3] relative">
        {imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            src={imageUrl}
            alt={`Gym Image ${index}`}
          />
        ))}
      </div>
      <div className="px-6 py-4">
        <div className="text-base mb-3 text-text font-semibold">
          {gym.gym_name}
        </div>
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