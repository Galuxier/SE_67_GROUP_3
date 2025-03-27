// TrainerList.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTrainersInGym } from "../services/api/TrainerApi";
import { getImage } from "../services/api/ImageApi";
function TrainerList() {
  const { id } = useParams();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        console.log(`Fetching trainers for gym_id: ${id}`);
        const response = await getTrainersInGym(id);
        console.log("Trainers response:", response);

        // ตรวจสอบว่า response มีค่าและเป็น object หรือไม่
        if (!response) {
          console.error("API response is undefined or null");
          setError("No response from server. Please try again later.");
          setTrainers([]);
          return;
        }

        // ตรวจสอบโครงสร้างของ response
        let trainersData = [];
        if (Array.isArray(response)) {
          console.log("Response is an array:", response);
          trainersData = response;
        } else if (response && Array.isArray(response.data)) {
          console.log("Response has data array:", response.data);
          trainersData = response.data;
        } else {
          console.error("API response is not in expected format:", response);
          setError("Invalid data format from server. Please try again later.");
          setTrainers([]);
          return;
        }
        // โหลดภาพ
        console.log("Trainers data structure:", trainersData);

        // Debug: ตรวจสอบ image_url หรือ profile_image
        trainersData.forEach((trainer, index) => {
          console.log(`Trainer ${index + 1}:`, {
            nickname: trainer.nickname,
            image_url: trainer.profile_picture_url,
          });
        });

        const trainersWithImages = await Promise.all(
          trainersData.map(async (trainer) => {
            const imageField = trainer.profile_picture_url;
            if (imageField) {
              try {
                const profile_picture_url = await getImage(imageField);
                console.log(
                  `Image URL for trainer ${trainer.nickname}:`,
                  profile_picture_url
                );
                return { ...trainer, profile_picture_url: profile_picture_url };
              } catch (error) {
                console.error(
                  `Error fetching image for trainer ${trainer.nickname}:`,
                  error
                );
                return {
                  ...trainer,
                  profile_picture_url:
                    "https://placehold.co/100x100?text=Trainer",
                };
              }
            }
            console.log(`No image field for trainer ${trainer.nickname}`);
            return {
              ...trainer,
              profile_picture_url: "https://placehold.co/100x100?text=Trainer",
            };
          })
        );
        setTrainers(trainersWithImages);
        console.log("Setting trainers to:", trainersData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch trainers. Please try again later.");
        console.error("Error fetching trainers:", err);
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchTrainers();
    } else {
      console.error("Gym ID is undefined");
      setError(
        "Gym ID is missing. Please ensure the URL contains a valid gym ID."
      );
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  const handleTrainerClick = (trainerItem) => {
    alert(`You clicked on ${trainerItem.nickname}`);
  };

  return (
    <div className="flex gap-8">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : trainers.length === 0 ? (
        <p className="text-gray-500">No trainers found.</p>
      ) : (
        trainers.map((trainerItem) => (
          <button
            key={trainerItem._id}
            className="flex flex-col items-center"
            onClick={() => handleTrainerClick(trainerItem)}
          >
            <img
              src={
                trainerItem.profile_picture_url ||
                "https://placehold.co/100x100?text=Trainer"
              }
              alt={trainerItem.nickname}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:text-text"
            />
            <p className="mt-2 text-sm  dark:text-text">
              {trainerItem.nickname}
            </p>
          </button>
        ))
      )}
    </div>
  );
}

export default TrainerList;
