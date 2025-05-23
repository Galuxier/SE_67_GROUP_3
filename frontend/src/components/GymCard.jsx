/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getImage } from "../services/api/ImageApi";

function GymCard({ gyms }) {
  const navigate = useNavigate();

  const handleGymClick = (gym) => {
    console.log("Navigating to:", `/gym/${gym._id}`);
    navigate(`/gym/${gym._id}`);
  };

  if (!gyms || gyms.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text/70">No gyms found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gyms.map((gym) => (
        <GymCardItem 
          key={gym._id || `gym-${Math.random()}`} 
          gym={gym} 
          onClick={() => handleGymClick(gym)} 
        />
      ))}
    </div>
  );
}

const GymCardItem = ({ gym, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับ loading

  const cardVariants = {
    hover: { 
      y: -5,
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true); // เริ่มต้นด้วยการแสดง loading
      if (gym.gym_image_urls && Array.isArray(gym.gym_image_urls) && gym.gym_image_urls.length > 0) {
        try {
          const urls = await Promise.all(
            gym.gym_image_urls.map(async (imageUrl) => {
              return await getImage(imageUrl);
            })
          );
          setImageUrls(urls);
        } catch (error) {
          console.error("Error fetching gym images:", error);
          setImageUrls([new URL("../assets/images/muaythai-001.jpg", import.meta.url).href]);
        }
      } else {
        setImageUrls([new URL("../assets/images/muaythai-001.jpg", import.meta.url).href]);
      }
      setIsLoading(false); // เมื่อโหลดเสร็จให้ปิด loading
    };
    
    fetchImages();
  }, [gym.gym_image_urls]);

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
    <motion.div
      className="bg-card rounded-xl overflow-hidden shadow-lg border border-border/30 hover:shadow-xl transition-all duration-300"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
      {/* Image Section with Skeleton */}
      <div className="relative h-60 overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : (
          imageUrls.map((imageUrl, index) => (
            <img
              key={index}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-700 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110" : "scale-100"}`}
              src={imageUrl}
              alt={`${gym.gym_name} image ${index + 1}`}
            />
          ))
        )}
        
        {gym.isFeatured && !isLoading && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs uppercase font-bold rounded-full px-3 py-1 shadow-md">
            Featured
          </div>
        )}
      </div>
      
      {/* Content Section with Skeleton */}
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-text mb-2">{gym.gym_name}</h3>
            <div className="flex items-center text-sm text-text/70 mb-3">
              <MapPinIcon className="w-4 h-4 flex-shrink-0 mr-1 text-text" />
              <span className="text-text">{gym.address?.district || "-"}, {gym.address?.province || "-"}</span>
            </div>
            <p className="text-text/80 text-sm mb-4 line-clamp-2 text-text">
              {gym.description || "Experience authentic Muay Thai training with expert coaches in a welcoming environment."}
            </p>
            <div className="flex justify-end">
              <button className="text-primary hover:text-secondary font-medium text-sm">
                View Details →
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {(gym.facilities || ["Traditional", "AC", "Showers"]).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-text/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GymCard;
