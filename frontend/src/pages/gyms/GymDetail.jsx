// src/pages/gyms/GymProfile.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GymCard from "../../components/GymCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import TrainerList from "../../components/Trainer";
import axios from "axios";

const GymProfile = () => {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await axios.get(
          `http://10.35.145.93/api/gyms/${id}`
        );
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

  if (!gym) return <div>ไม่พบข้อมูล</div>;
  // className="h-2/3  flex justify-center w-full"
  return (
    <div className="flex gap-6 items-start w-full max-w-7xl mx-auto">
      {/* 📌 เนื้อหาหลัก */}
      <div className="flex flex-col items-center w-2/3">
        <div className="w-full">
          {/* ภาพ */}
          <img src={gym.image_url} alt={gym.gym} className="w-full" />

          <div className="mt-4 w-full">
            <p className="font-bold text-left mt-5 text-3xl">{gym.gym}</p>

            <div className="flex items-center mt-5">
              <FaMapMarkerAlt className="w-10 h-10" />
              <p className="px-4 text-2xl font-semibold">
                {gym.location.district}, {gym.location.province}
              </p>
            </div>

            {/* About Us */}
            <div className="mt-4 w-full">
              <p className="text-2xl font-semibold">About Us</p>
              <div className="w-full h-32 bg-gray-300 rounded-md">
                พวกเราสอนได้ดี
              </div>
            </div>

            {/* Trainers */}
            <div className="mt-4 w-full">
              <p className="text-2xl font-semibold">Trainers</p>
              <div className="w-full mt-2">
                <TrainerList />
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-4 w-full">
              <p className="text-2xl font-semibold">Facilities</p>
              <div className="w-full h-32 bg-gray-300 rounded-md">
                สิ่งอำนวยความสะดวก
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📌 Sidebar "คอร์ส" */}
      <div className="w-1/3 bg-white p-4 shadow-lg rounded-lg sticky top-20 h-fit flex-shrink-0 justify-center">
        <p className="text-2xl font-semibold text-center">All Course</p>
        <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">
          คอร์สที่ 1
        </div>
        <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">
          คอร์สที่ 2
        </div>
        <div className="bg-gray-300 h-24 w-full rounded-md mt-2 flex items-center justify-center">
          คอร์สที่ 3
        </div>
      </div>

    </div>
  );
};

export default GymProfile;