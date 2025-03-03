import { FaMapMarkerAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export const gyms = [
  {
    id: 1,
    image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url)
      .href,
    gym: "Phuket Fight Club",
    location: {
      district: "Mueang",
      province: "Phuket",
    },
  },
  {
    id: 2,
    image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url)
      .href,
    gym: "Bangkok Fight Club",
    location: {
      district: "Bang Rak",
      province: "Bangkok",
    },
  },
  {
    id: 3,
    image_url: new URL("../assets/images/muaythai-003.png", import.meta.url)
      .href,
    gym: "Chiang Mai Fight Club",
    location: {
      district: "Mueang",
      province: "Chiang Mai",
    },
  },
];


function GymCard() {
  const navigate = useNavigate();
  const handleGymClick = (gym) => {
    console.log("Navigating to:", `/gym/detail/${gym.id}`);
    navigate(`/gym/detail/${gym.id}`);
    //alert(`You clicked on ${gym.gym}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {gyms.map((gym) => (
        <button
          key={gym.id}
          className="max-w-xs rounded overflow-hidden shadow-lg bg-white text-left cursor-pointer transition transform hover:scale-105"
          onClick={() => handleGymClick(gym)}
        >
          <img
            className="w-full aspect-[4/3] object-cover"
            src={gym.image_url}
            alt={gym.gym}
          />
          <div className="px-6 py-4">
            <div className="text-gray-700 text-base mb-3">{gym.gym}</div>
            <div className="flex items-center font-base text-lg mb-2">
              <span className="mr-2">
                <FaMapMarkerAlt />
              </span>
              <span className="text-gray-700 text-base mr-1">
                {gym.location.district} ,
              </span>
              <span className="text-gray-700 text-base">
                {gym.location.province}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default GymCard;