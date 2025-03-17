import { Link } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getAllGyms } from "../../services/api/GymApi";
import GymCard from "../../components/GymCard";
import provinceData from "../../data/thailand/address/provinces.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import GymFilter from "../../components/gyms/GymFilter";

function GymHome() {
  const [province, setProvince] = useState("All");
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [visibleGyms, setVisibleGyms] = useState(30);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

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

  const loadMoreGyms = () => {
    setVisibleGyms((prevVisibleGyms) => prevVisibleGyms + 30);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="container px-5 sm:px-0 pb-5 pt-5 mx-auto">
        {/* Header */}
        <div className="flex justify-center relative mb-6">
          <h1 className="text-3xl font-bold text-text">All Gym</h1>
          {user?.role?.includes("gym_owner") && (
            <Link to="/gym/addgym">
              <button className="bg-secondary hover:bg-primary rounded-full w-8 h-8 flex items-center justify-center absolute right-0">
                <PlusCircleIcon className="h-10 w-10 text-white" />
              </button>
            </Link>
          )}
        </div>

        {/* Sidebar and GymList */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Button สำหรับ Mobile */}
          <div className="md:hidden flex justify-center mb-4">
            <button
              onClick={toggleFilterModal}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>

          {/* Sidebar */}
          <div className="hidden md:block w-full md:w-48 bg-background rounded-lg shadow-lg flex-shrink-0">
            <GymFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            />
          </div>

          {/* GymList */}
          <div className="flex-grow">
            <GymCard gyms={filteredGyms.slice(0, visibleGyms)} />
            {filteredGyms.length > visibleGyms && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreGyms}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal สำหรับ Filter บน Mobile */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                &times;
              </button>
            </div>
            <GymFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GymHome;