// src/pages/gyms/GymProfile.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GymCard from "../../components/GymCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import TrainerList from "../../components/Trainer";
import { PlusCircleIcon, PencilSquareIcon,KeyIcon } from "@heroicons/react/24/outline";
import EditGymModal from "../../components/gyms/EditGymModal";
import { useNavigate } from "react-router-dom";
import { getGymFromId } from "../../services/api/GymApi";

const GymProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await getGymFromId(id);
        console.log(response);
        setGym(response);
      } catch (error) {
        console.error("Error fetching gym profile:", error);
      }
    };
    fetchGym();
  }, [id]);

  if (!gym) return <div>Loading...</div>;

  const handleSave = (updatedGym) => {
    setGym(updatedGym);
    setIsModalOpen(false);
  };

  const Back = () => {
    navigate(-1);
  };

  const handleGymForRent = () => {
    navigate('/gym/ForRent');
  };


  // className="h-2/3  flex justify-center w-full"
  return (
    <div className="relative min-h-screen bg-gray-100">
    <button
      onClick={Back}
      className="px-4 py-2 bg-rose-600 text-white rounded mb-4"
    >
      Back
    </button>

    <div className="grid grid-rows-[auto_1fr] gap-6">
      {/* รูปภาพ */}
      <div className="bg-blue-100 w-full max-w-5xl mx-auto rounded-lg overflow-hidden">
        <img
          src={new URL("../../assets/images/muaythai-001.jpg", import.meta.url).href}
          className="object-cover w-full h-full"
          alt="Gym"
        />
      </div>

      {/* รายละเอียดและเนื้อหา */}
      <div className="grid lg:grid-cols-[300px_auto_300px] gap-6">
        {/* แถบด้านซ้าย */}
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <button
            className="px-4 py-2 text-black rounded-md hover:bg-gray-200 transition"
            onClick={() => setIsModalOpen(true)}
            title="Edit Gym"
          >
            <PencilSquareIcon className="h-10 w-10" />
          </button>
          <button
            className="px-4 py-2 text-black rounded-md hover:bg-gray-200 transition mt-4"
            onClick={handleGymForRent}
            title="Rent Gym"
          >
            <KeyIcon className="h-10 w-10" />
          </button>
        </div>

        {/* ส่วนกลาง */}
        <div className="bg-white p-6 rounded-lg w-full">
          <di v className="flex justify-between items-center mb-4 mr-4">
            <h1 className="font-bold text-3xl mb-4">{gym.gym_name}</h1>
            <h1 className="ml-auto pr-3">Open For Rent:</h1>
           <div className="flex items-center justify-end">
              <p className="ml-auto text-rose-600 underline">Detail</p>
           </div>
          </di>
          
          
          <div className="flex items-center mt-4">
            <FaMapMarkerAlt className="w-8 h-8 text-gray-600" />
            <p className="ml-4 text-xl font-semibold">
              {gym.address.district}, {gym.address.province}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">About Us</h2>
            <div className="w-full h-32 bg-gray-300 rounded-md mt-2 p-2">
              {gym.description || "No Description Provided"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Trainer</h2>
            <div className="mt-2">
              <TrainerList />
            </div>
          </div>
        </div>

        {/* แถบด้านขวา */}
        <div className="bg-white p-4 rounded-lg justify-center w-full">
          <h2 className="text-xl font-semibold text-center mb-4">All Course</h2>
          <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">Course 1</div>
          <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">Course 2</div>
          <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">Course 3</div>
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
  );
};

export default GymProfile;
