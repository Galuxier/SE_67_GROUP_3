// src/pages/gyms/GymProfile.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { gyms } from "../../components/GymCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import TrainerList from "../../components/Trainer";
import { PlusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import EditGymModal from "../../components/gyms/EditGymModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GymProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await axios.get(`http://10.35.145.93/api/gyms/${id}`);
        setGym(response.data);
      } catch (error) {
        console.error("Error fetching gym profile:", error);
      }
    };
    fetchGym();
  }, [id]);

  console.log("Gymprofile Loaded");
  useEffect(() => {
    console.log("Gym ID from URL:", id);
    const foundGym = gyms.find((g) => g.id === Number(id));
    console.log("Found Gym:", foundGym);
    setGym(foundGym);
  }, [id]);

  if (!gym) return <div>Loading...</div>;

  const handleSave = (updatedGym) => {
    setGym(updatedGym);
    setIsModalOpen(false);
  };
  const Back = () => {
    navigate(-1);
  }


  // className="h-2/3  flex justify-center w-full"
  return (
    <div className="relative h-screen bg-gray-100">
      <button
        onClick={Back}
        className="px-4 py-2 bg-rose-600 text-white rounded"
      >
        Back
      </button>

      <div className="grid grid-rows-2">
        {/* ส่วนของรูปภาพ */}
        <div className="bg-blue-100 w-full max-w-4xl mx-auto my-auto">
          <img src={gym.image_url} className="object-cover w-full h-full" />
        </div>

        <div className="bg-gray-100 grid grid-cols-[300px_1500px_300px] gap-3">
          <div className="bg-white p-1 rounded-lg flex justify-center">
            <button className="px-4 py-2 text-black rounded-md">
              <PencilSquareIcon
                onClick={() => setIsModalOpen(true)}
                className="h-10 w-10"
              />
            </button>
          </div>

          <div className="bg-white p-1 rounded-lg w-full">
            <p className="font-bold text-3xl mt-5 ">{gym.gym}</p>

            <div className="flex items-center mt-5">
              <FaMapMarkerAlt className="w-10 h-10" />
              <p className="px-4 text-2xl font-semibold">
                {gym.address.district}, {gym.address.province}
              </p>
            </div>

            <div className="mt-4 w-full">
              <p className="text-2xl font-semibold">About Us</p>
              <div className="w-full h-32 bg-gray-300 rounded-md">
                The best gym in the world
              </div>
            </div>

            <div className="mt-4 w-full">
              <p className="text-2xl font-semibold">Trainer</p>
              <div className="mt-2 w-full">
                <TrainerList />
              </div>
            </div>

            <div className="mt-4 w-full">
              <p className="text-2xl font-semibold">Facilities</p>
              <div className="w-full h-64 bg-gray-300 rounded-md">the best</div>
            </div>
          </div>

          <div className="bg-white p-1 rounded-lg justify-center w-full">
            <p className="text-xl font-semibold">All Course</p>
            <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">
              Course 1
            </div>
            <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">
              Course 2
            </div>
            <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">
              Course 3
            </div>
          </div>
        </div>

        {isModalOpen && (
          <EditGymModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            gymData={gym}
            onSave={handleSave}
          />
        )}
      </div>
   </div>
  );
};

export default GymProfile;
