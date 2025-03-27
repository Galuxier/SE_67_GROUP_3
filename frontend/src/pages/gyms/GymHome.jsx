import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, FireIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { searchGyms } from "../../services/api/GymApi"; // Ensure this path matches your project structure
import GymCard from "../../components/GymCard";
import provinceData from "../../data/thailand/address/provinces.json"; // Ensure this path is correct
import districtData from "../../data/thailand/address/districts.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import GymFilter from "../../components/gyms/GymFilter";

function GymHome() {
  const navigate = useNavigate();
  const [province, setProvince] = useState("All");
  const [district, setDistrict] = useState("All");
  const [facility, setFacility] = useState("");
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Default limit as per API
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("name"); // Default sort as per API
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setIsLoading(true);
        const params = {
          query: searchQuery || undefined,
          province: province !== "All" ? province : undefined,
          district: district !== "All" ? district : undefined,
          facility: facility || undefined,
          page,
          limit,
          sort,
        };

        const response = await searchGyms(params);
        setGyms(response.data);
        setFilteredGyms(response.data);
        setTotalPages(response.pagination?.totalPages || 1);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
        setIsLoading(false);
      }
    };

    fetchGyms();
  }, [province, district, facility, searchQuery, page, sort]);

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
    setDistrict("All"); // Reset district when province changes
    setPage(1); // Reset to first page when filter changes
  };

  const handleDistrictSelect = (districtName) => {
    setDistrict(districtName);
    setPage(1);
  };

  const handleFacilitySelect = (facilityName) => {
    setFacility(facilityName);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const toggleFilterExpanded = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const handleClearFilters = () => {
    setProvince("All");
    setDistrict("All");
    setFacility("");
    setSearchQuery("");
    setSort("name");
    setPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(6)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-card border border-border/30 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
              <div className="flex items-center space-x-1 mb-3">
                <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // จำนวนหน้าที่ต้องการแสดงสูงสุดใน pagination
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, page - halfRange);
    let endPage = Math.min(totalPages, page + halfRange);

    // ปรับแต่ง startPage และ endPage เพื่อให้แสดงจำนวนหน้าคงที่ถ้าเป็นไปได้
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-10 space-x-2">
        {/* Previous Button */}
        <motion.button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary hover:bg-secondary text-white"
          }`}
          whileHover={{ scale: page === 1 ? 1 : 1.05 }}
          whileTap={{ scale: page === 1 ? 1 : 0.95 }}
        >
          Previous
        </motion.button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <motion.button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 rounded-lg bg-card text-text hover:bg-primary hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              1
            </motion.button>
            {startPage > 2 && <span className="px-2 text-text">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <motion.button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              pageNum === page
                ? "bg-primary text-white"
                : "bg-card text-text hover:bg-primary hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {pageNum}
          </motion.button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-text">...</span>}
            <motion.button
              onClick={() => handlePageChange(totalPages)}
              className="px-4 py-2 rounded-lg bg-card text-text hover:bg-primary hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {totalPages}
            </motion.button>
          </>
        )}

        {/* Next Button */}
        <motion.button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            page === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary hover:bg-secondary text-white"
          }`}
          whileHover={{ scale: page === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: page === totalPages ? 1 : 0.95 }}
        >
          Next
        </motion.button>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-primary overflow-hidden z-0">
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-16">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Find Your Perfect Muay Thai <span className="text-yellow-300">Gym</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              Explore top-rated training facilities across Thailand and take your Muay Thai journey to the next level
            </p>
            <div className="relative left-5 flex items-center max-w-xl">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search gyms by name, location, or features..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 pl-5 pr-12 rounded-full border-0 shadow-lg text-gray-800 focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto mt-6 pb-12 -mt-12 relative z-20">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel for Desktop */}
          <motion.div
            className={`hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 flex-shrink-0 sticky top-4 self-start transition-all duration-300 ${
              isFilterExpanded ? "lg:w-80" : "lg:w-72"
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-primary text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filter Gyms</h3>
                <button onClick={handleClearFilters} className="text-sm underline hover:text-white/80">
                  Clear All
                </button>
              </div>
            </div>
            <div className="p-5 rounded-b-2xl">
              <GymFilter
                province={province}
                district={district}
                facility={facility}
                handleProvinceSelect={handleProvinceSelect}
                handleDistrictSelect={handleDistrictSelect}
                handleFacilitySelect={handleFacilitySelect}
                provinceData={provinceData}
                districtData={districtData}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <FireIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-bold text-text">
                  {isLoading
                    ? "Finding gyms..."
                    : filteredGyms.length > 0
                    ? `${filteredGyms.length} Gyms ${province !== "All" ? `in ${province}` : "Found"}`
                    : "No gyms matching your criteria"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {(province !== "All" || district !== "All" || facility || searchQuery) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {province !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Location: {province}
                        <button
                          onClick={() => setProvince("All")}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {district !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        District: {district}
                        <button
                          onClick={() => setDistrict("All")}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {facility && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        Facility: {facility}
                        <button
                          onClick={() => setFacility("")}
                          className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        Search: {searchQuery}
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            if (searchInputRef.current) searchInputRef.current.value = "";
                          }}
                          className="ml-1 text-amber-600 hover:text-amber-800 dark:text-amber-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="py-2 px-3 rounded-lg border border-border text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="name">Sort by: Name</option>
                  <option value="latest">Sort by: Latest</option>
                </select>
                <button
                  onClick={toggleFilterModal}
                  className="lg:hidden bg-primary hover:bg-secondary text-white flex items-center gap-2 rounded-lg py-2 px-4 transition-colors"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              renderSkeletonCards()
            ) : filteredGyms.length > 0 ? (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <GymCard gyms={filteredGyms} />
                {totalPages > 1 && renderPagination()}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl shadow-md">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-text">No gyms found</h3>
                <p className="mt-1 text-text/70">Try adjusting your search or filter criteria</p>
                <div className="mt-6">
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {user && user.role && user.role.includes("gym_owner") && (
          <motion.div
            className="fixed bottom-6 right-6 z-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          >
            <Link
              to="/gym/management/create"
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Add New Gym</span>
            </Link>
          </motion.div>
        )}
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter</h2>
              <button onClick={toggleFilterModal} className="text-text hover:text-primary">
                ×
              </button>
            </div>
            <GymFilter
              province={province}
              district={district}
              facility={facility}
              handleProvinceSelect={handleProvinceSelect}
              handleDistrictSelect={handleDistrictSelect}
              handleFacilitySelect={handleFacilitySelect}
              provinceData={provinceData}
              districtData={districtData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GymHome;