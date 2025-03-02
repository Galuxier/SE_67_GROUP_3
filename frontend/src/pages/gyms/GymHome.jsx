import { Link } from "react-router-dom";
import { PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getAllGyms } from "../../services/api/GymApi";
import GymCard from "../../components/GymCard";

function GymHome() {
  const [province, setProvince] = useState("Province");
  const [isOpen, setIsOpen] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await getAllGyms(); // เรียกใช้ API function
        setGyms(response); // อัปเดตข้อมูล gyms
        setFilteredGyms(response); // ตั้งค่า filteredGyms ด้วยข้อมูลทั้งหมด
        // console.log("Gym List:", response);
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
      }
    };

    fetchGyms();
  }, []);

  const provinces = ["Test", "Test2"];

  // ฟังก์ชันกรองข้อมูล gyms ตามจังหวัด
  const filterGymsByProvince = (provinceName) => {
    if (provinceName === "Province") {
      setFilteredGyms(gyms); // แสดงข้อมูลทั้งหมด
    } else {
      const filtered = gyms.filter(
        (gym) => gym.address.province === provinceName
      );
      setFilteredGyms(filtered); // แสดงข้อมูลที่กรองแล้ว
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Gym</h1>
      <div className="gap-6 flex items-center">
        {/* กล่องทางด้านซ้าย */}
        <div className="w-1/4 justify-center">
          <h2 className="text-4xl font-semibold mb-4 text-center">Filter</h2>
          {/* จังหวัด */}
          <div className="mb-4 justify-center relative py-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full rounded py-2 px-3 justify-center flex items-center"
            >
              <span className="text-gray-500 text-3xl">{province}</span>
              <ChevronDownIcon
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 cursor-pointer absolute right-2"
              />
            </button>
            {isOpen && (
              <div className="wabsolute w-full mt-1 bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10">
                <button
                  key="all"
                  onClick={() => {
                    setProvince("Province");
                    setIsOpen(false);
                    filterGymsByProvince("Province");
                  }}
                  className="w-full rounded py-2 px-3 justify-center flex items-center"
                >
                  All Provinces
                </button>
                {provinces.map((provinceName, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProvince(provinceName);
                      setIsOpen(false);
                      filterGymsByProvince(provinceName);
                    }}
                    className="w-full rounded py-2 px-3 justify-center flex items-center"
                  >
                    {provinceName}
                  </button>
                ))}
              </div>
            )}
            <hr />
          </div>
          {/* สิ่งอำนวยความสะดวก */}
          <div className="mb-4 justify-center relative py-10">
            <button className="w-full rounded py-2 px-3 justify-center flex items-center">
              <span className="text-gray-500 text-3xl">Facilities</span>
              <ChevronDownIcon className="h-10 w-10 cursor-pointer absolute right-2" />
            </button>
            <hr />
          </div>
          {/* สำหรับ Addgym */}
          <div className="justify-center flex items-center">
            <Link to="/gym/addgym">
              <button className="px-4 py-2 text-black rounded-md">
                <PlusCircleIcon className="h-10 w-10" />
              </button>
            </Link>
          </div>
        </div>
        {/* กล่องทางด้านขวา */}
        <div className="w-3/4">
          <GymCard gyms={filteredGyms} />
        </div>
      </div>
    </div>
  );
}

export default GymHome; 