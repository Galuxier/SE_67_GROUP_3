import { Link } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getAllGyms } from "../../services/api/GymApi";
import GymCard from "../../components/GymCard";
import provinceData from "../../data/thailand/address/provinces.json";
import axios from "axios";

function GymHome() {
  const [province, setProvince] = useState("All");
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await getAllGyms();
        setGyms(response);
        setFilteredGyms(response);
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
      }
    };

    fetchGyms();
  }, []);

  useEffect(() => {
    filterGymsByProvince(province);
  }, [province]);

  const filterGymsByProvince = (provinceName) => {
    if (provinceName === "All") {
      setFilteredGyms(gyms);
    } else {
      const filtered = gyms.filter(
        (gym) => gym.address.province === provinceName
      );
      setFilteredGyms(filtered);
    }
  };

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
  };

  return (
    <div className="bg-white-500 min-h-screen">
      <div className="container mx-auto px-4 py-2">
        {/* Header */}
        <div className="flex justify-center relative mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Gym</h1>
          <Link to="/gym/addgym">
            <button className="bg-rose-600 hover:bg-rose-600 rounded-full w-8 h-8 flex items-center justify-center absolute right-0">
              <PlusCircleIcon className="h-10 w-10 text-white" />
            </button>
          </Link>
        </div>

        {/* Sidebar and GymList */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-56 bg-white rounded-lg shadow-lg flex-shrink-0">
            <div className="p-2 border-b border-gray-200">
              <h2 className="font-medium text-gray-700">Filter</h2>
            </div>
            <div className="p-2">
              <div className="mb-2 justify-center relative py-2">
                <label className="block mb-1">Province</label>
                <select
                  className="border p-2 w-full"
                  value={province}
                  onChange={(e) => handleProvinceSelect(e.target.value)}
                >
                  <option value="All">All</option>
                  {provinceData
                    .sort((a, b) => a.provinceNameTh.localeCompare(b.provinceNameTh))
                    .map((province, index) => (
                      <option key={index} value={province.provinceNameTh}>
                        {province.provinceNameTh}
                      </option>
                    ))}
                </select>
              </div>

              {/* <div className="mb-2 justify-center relative py-2">
                <label className="block mb-1">Facilities</label>
                <select className="border p-2 w-full">
                  <option>-- Select --</option>
                </select>
              </div> */}
            </div>
          </div>

          <div className="flex-grow">
            <GymCard gyms={filteredGyms} />
          </div>
        </div>
      </div>
    </div>
  );
} 

export default GymHome;
