import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import TrainerList from "../../components/Trainer";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import EditGymModal from "../../components/gyms/EditGymModal";
import { useNavigate } from "react-router-dom";
import { getGymFromId } from "../../services/api/GymApi";

const GymProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? gym.gym_image_url.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === gym.gym_image_url.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ส่วนของรูปภาพและปุ่ม Back */}
      <div className="relative flex justify-center items-center pt-8" style={{ height: "400px" }}>
        {/* ปุ่ม Back อยู่ซ้ายบนของระนาบรูปภาพ */}
        <button
          onClick={Back}
          className="absolute top-8 left-4 z-10 px-4 py-2 bg-rose-600 text-white rounded"
        >
          Back
        </button>

        {/* รูปภาพ */}
        <img
          src={`http://10.35.145.93:3000/images/${gym.gym_image_url[currentImageIndex].split('/').pop()}`}
          alt={`Gym Image ${currentImageIndex}`}
          className="h-full w-auto object-contain" // ใช้ object-contain เพื่อให้รูปภาพขยายเต็มความสูงโดยคงอัตราส่วนเดิม
        />

        {/* ปุ่มเลื่อนรูปภาพ */}
        <button
          onClick={prevImage}
          className="absolute left-24 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          &larr;
        </button>
        <button
          onClick={nextImage}
          className="absolute right-24 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          &rarr;
        </button>
      </div>

      {/* ส่วนข้อมูล Gym */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg">
          {/* แบ่งเป็นฝั่งซ้ายและขวา */}
          <div className="flex justify-between">
            {/* ฝั่งซ้าย: ชื่อและที่อยู่ */}
            <div>
              {/* ชื่อโรงยิม */}
              <p className="font-bold text-3xl">{gym.gym_name}</p>

              {/* ที่อยู่ */}
              <div className="flex items-center mt-2">
                <FaMapMarkerAlt className="w-6 h-6" />
                <p className="px-4 text-2xl font-semibold">
                  {gym.address.district}, {gym.address.province}
                </p>
              </div>
            </div>

            {/* ฝั่งขวา: Contact และปุ่ม Edit ในระนาบเดียวกัน */}
            <div className="flex items-start gap-4">
              {/* Contact */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                {Object.entries(gym.contact || {}).map(
                  ([key, value]) =>
                    value && ( // แสดงเฉพาะ field ที่มีค่า
                      <p key={key} className="text-gray-700">
                        <span className="capitalize">{key}:</span> {value}
                      </p>
                    )
                )}
              </div>

              {/* ปุ่ม Edit */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-black rounded-md"
              >
                <PencilSquareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* About Us */}
          <div className="mt-4">
            <p className="text-2xl font-semibold">About Us</p>
            <div className="w-full h-32 bg-gray-100 rounded-md p-4 mt-2">
              {gym.description}
            </div>
          </div>

          {/* Trainer */}
          <div className="mt-4">
            <p className="text-2xl font-semibold">Trainer</p>
            <div className="mt-2">
              {/* <TrainerList /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal สำหรับแก้ไข */}
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