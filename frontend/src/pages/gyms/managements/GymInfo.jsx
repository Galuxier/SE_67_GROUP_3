import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGymFromId } from "../../../services/api/GymApi";
import { getImage } from "../../../services/api/ImageApi";
import {
  PencilSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import EditGymModal from "../../../components/gyms/EditGymModal";

function GymInfo() {
  const { gym_id } = useParams();
  const [gym, setGym] = useState({
    gym_name: "",
    description: "",
    address: { province: "", district: "" },
    contact: { email: "", tel: "" },
    facilities: [],
    gym_image_urls: [],
  });
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const defaultImage = "https://placehold.co/150x150";

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const gymData = await getGymFromId(gym_id);
        console.log("Gym Data:", gymData);
        setGym(gymData);

        if (gymData?.gym_image_urls && gymData.gym_image_urls.length > 0) {
          console.log("Gym Image URLs (raw):", gymData.gym_image_urls);
          const loadedImages = await Promise.all(
            gymData.gym_image_urls.map(async (url, index) => {
              try {
                const imageData = await getImage(url);
                console.log(`Image ${index} Data:`, imageData);
                return imageData; // คาดหวังว่า imageData จะเป็น URL เต็มหรือ base64 string
              } catch (error) {
                console.error(`Error loading image ${url}:`, error);
                return defaultImage;
              }
            })
          );
          console.log("Loaded Image URLs:", loadedImages);
          setImageUrls(loadedImages);
        } else {
          setImageUrls([]);
        }

        setLoading(false);
        setImageLoading(false);
      } catch (error) {
        console.error("Error fetching gym data:", error);
        setLoading(false);
        setImageLoading(false);
      }
    };

    fetchGymData();
  }, [gym_id]);

  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Gym Information</h2>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Gym Name</label>
        <input
          type="text"
          name="gym_name"
          defaultValue={gym.gym_name}
          readOnly
          className="w-full border border-gray-300 border-border rounded-lg py-2 px-4 focus:outline-none dark:bg-background"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Description</h3>
        <textarea
          name="description"
          defaultValue={gym.description}
          readOnly
          rows="4"
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none dark:bg-background"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Location</h3>
        <input
          type="text"
          name="location"
          defaultValue={`${gym.address.province}, ${gym.address.district}`}
          readOnly
          className="w-full border border-gray-300 border-boder rounded-lg py-2 px-4 focus:outline-none bg-background"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Email</label>
        <input
          type="text"
          name="email"
          defaultValue={gym.contact.email}
          readOnly
          className="w-full border border-gray-300 border-border rounded-lg py-2 px-4 focus:outline-none bg-background"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Phone</label>
        <input
          type="text"
          name="phone"
          defaultValue={gym.contact.tel}
          readOnly
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none border-border bg-background"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Facilities</h3>
        <p>
          {gym.facilities && gym.facilities.length > 0
            ? gym.facilities.join(", ")
            : "No facilities available"}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Images</h3>
        {imageLoading ? (
          <p>Loading images...</p>
        ) : imageUrls.length > 0 ? (
          <div className="flex gap-4">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Gym Image ${index}`}
                className="w-32 h-32 object-cover rounded-md"
                onError={(e) => {
                  console.error(`Failed to load image ${url}`);
                  e.target.src = defaultImage;
                }}
              />
            ))}
          </div>
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={handleModalOpen}
          className="p-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>

      {isModalOpen && (
        <EditGymModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          gymData={gym}
          onSave={(updatedGym) => setGym(updatedGym)}
        />
      )}
    </div>
  );
}

export default GymInfo;
