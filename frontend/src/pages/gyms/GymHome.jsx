import { Link } from "react-router-dom";
import { PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getAllGyms } from "../../services/api/GymApi";
import GymCard from "../../components/GymCard";

function GymHome() {
 // const [province, setProvince] = useState("Province");
  const [isOpen, setIsOpen] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [selectedProvince,setSelectedProvince] = useState('Province');
  const [selectedFacilities,setSelectedFacilities] = useState('');
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
  const facilities = ['test1', 'test2'];

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
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  }

  const handleFacilitiesChange = (e) => {
    setSelectedFacilities(e.target.value);
  }
  return (
    <div className="min-h-screen flex bg-gray-100">
      
        {/* กล่องทางด้านซ๊าย */}
        <div className="w-1/6 bg-white p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-center">Filter</h2>
          {/* จังหวัด */}
          <div className="mb-4">
            <label className="block mb-1">Province</label>
            <select
              className="p-2 border w-full"
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value=''>Selected Province</option>
              {provinces.map((provinceName, index) => (
                <option key={index} value={provinceName}>
                  {provinceName}
                </option>
              ))}
            </select>
            <hr />
          </div>

          {/* สิ่งอำนวยความจะดวก */}
          <div className="mb-4">
            <label className="block mb-1">Facilities</label>
            <select
              className="p-2 border w-full"
              value={selectedFacilities}
              onChange={handleFacilitiesChange}
            >
              <option value=''>Selected Facilities</option>
              {facilities.map((facilitiesName, index) => (
                <option key={index} value={facilitiesName}>
                  {facilitiesName}
                </option>
              ))}
            </select>
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
        <div className="flex-1 p-4">
          <h1 className="text-3xl font-bold text-center mb-6">All Gym</h1>
          <GymCard gyms={filteredGyms} />
        </div>
    </div>
  );
}

export default GymHome; 