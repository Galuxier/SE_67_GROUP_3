import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGymFromId } from "../../../services/api/GymApi";
import {
  PencilSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import EditGymModal from "../../../components/gyms/EditGymModal";
import { getImage } from "../../../services/api/ImageApi";
function GymInfo() {
  const { gym_id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const gymData = await getGymFromId(gym_id); // ดึงข้อมูล Gym ตาม gym_id
        setGym(gymData); // ตั้งค่าข้อมูล gym
        setLoading(false); // ปิดสถานะการโหลด
      } catch (error) {
        console.error("Error fetching gym data:", error);
        setLoading(false);
      }
    };

    fetchGymData(); // เรียกใช้ฟังก์ชันเมื่อโหลด component
  }, [gym_id]);

  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);

  console.log(gym_id);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Gym Information</h2>

      {/* แสดงข้อมูล Gym */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Gym Name</label>
        <input
          type="text"
          name="gym_name"
          value={gym?.gym_name}
          readOnly
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none "
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Description</h3>
        <input
          type="text"
          name="Description"
          value={gym?.description}
          readOnly
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none "
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Location</h3>
        <input
          type="text"
          name="gym_name"
          value={`${gym?.address?.province}, ${gym?.address?.district}`}
          readOnly
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none "
        />
      </div>

      <div className="mb-6">
      <label className="block text-lg font-medium mb-2">Email</label>
        <input
          type="text"
          name="Phone"
          value={gym?.contact?.email}
          readOnly
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none "
        />
      </div>

      <div className="mb-6">
      <label className="block text-lg font-medium mb-2">Phone</label>
        <input
          type="text"
          name="Phone"
          value={gym?.contact?.tel}
          readOnly
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none "
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Facilities</h3>
        <p>{gym?.facilities?.join(", ")}</p>{" "}
        {/* หาก facilities เป็น array ให้แสดงข้อมูล */}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Images</h3>
        <div className="flex gap-4">
          {gym?.gym_image_urls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Gym Image ${index}`}
              className="w-32 h-32 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      
      <div className="mb-6">
        <button
          onClick={handleModalOpen} // เปิด Modal เมื่อคลิก
          className="p-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>

      {/* แสดง Modal เมื่อ isModalOpen เป็น true */}
      {isModalOpen && (
        <EditGymModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          gymData={gym}
          onSave={(updatedGym) => setGym(updatedGym)} // อัปเดตข้อมูล gym หลังจากการแก้ไข
        />
      )}
    </div>
  );
}

export default GymInfo;
