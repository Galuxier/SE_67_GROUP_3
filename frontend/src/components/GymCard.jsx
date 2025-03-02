import { FaMapMarkerAlt } from "react-icons/fa";

function GymCard({ gyms }) {

  const image = new URL("../assets/images/muaythai-001.jpg", import.meta.url).href;
  const handleGymClick = (gym) => {
    console.log("Your Clicked gym _id: ",gym._id)
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {gyms.map((gym) => (
        <button
          key={gym._id}
          className="max-w-xs rounded overflow-hidden shadow-lg bg-white text-left cursor-pointer transition transform hover:scale-105"
          onClick={() => handleGymClick(gym)}
        >
          <img
            className="w-full aspect-[4/3] object-cover"
            src={image} // ใช้รูปภาพแรกในอาร์เรย์
            alt={gym.gym_name}
          />
          <div className="px-6 py-4">
            <div className="text-gray-700 text-base mb-3">{gym.gym_name}</div>
            <div className="flex items-center font-base text-lg mb-2">
              <span className="mr-2">
                <FaMapMarkerAlt />
              </span>
              <span className="text-gray-700 text-base mr-1">
                {gym.address.district} ,
              </span>
              <span className="text-gray-700 text-base">
                {gym.address.province}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default GymCard;