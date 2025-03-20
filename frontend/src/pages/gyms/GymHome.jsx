import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, MapPinIcon, StarIcon, FireIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { getAllGyms } from "../../services/api/GymApi";
import GymCard from "../../components/GymCard";
import provinceData from "../../data/thailand/address/provinces.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import GymFilter from "../../components/gyms/GymFilter";

function GymHome() {
  const navigate = useNavigate();
  const [province, setProvince] = useState("All");
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [visibleGyms, setVisibleGyms] = useState(30);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Featured gyms (can be determined by ratings or special tags)
  const [featuredGyms, setFeaturedGyms] = useState([]);

  // Categories for quick filtering
  const categories = ["All", "Popular", "Traditional", "Modern", "Kids Friendly"];

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setIsLoading(true);
        const response = await getAllGyms();
        
        // Add artificial delay for loading animation
        setTimeout(() => {
          setGyms(response);
          setFilteredGyms(response);
          
          // Set featured gyms (top 3 based on some criteria)
          const featured = [...response]
            .slice(0, 3)
            .map(gym => ({
              ...gym,
              isFeatured: true
            }));
          
          setFeaturedGyms(featured);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
        setIsLoading(false);
      }
    };

    fetchGyms();
  }, []);

  // Apply all filters: province, search query, and category
  useEffect(() => {
    let filtered = [...gyms];
    
    // Filter by province
    if (province !== "All") {
      filtered = filtered.filter(gym => gym.address?.province === province);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(gym => 
        gym.gym_name?.toLowerCase().includes(query) || 
        gym.description?.toLowerCase().includes(query) ||
        gym.address?.district?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category (this would need category data in your gym objects)
    if (activeCategory !== "All") {
      // This is just an example, adjust based on your actual data structure
      filtered = filtered.filter(gym => 
        gym.categories?.includes(activeCategory) || 
        (activeCategory === "Popular" && (gym.rating >= 4.5 || gym.isFeatured))
      );
    }
    
    setFilteredGyms(filtered);
  }, [province, searchQuery, activeCategory, gyms]);

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const loadMoreGyms = () => {
    setVisibleGyms((prevVisibleGyms) => prevVisibleGyms + 30);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const toggleFilterExpanded = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const handleClearFilters = () => {
    setProvince("All");
    setSearchQuery("");
    setActiveCategory("All");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Loading skeleton UI
  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(6).fill().map((_, index) => (
        <div key={index} className="animate-pulse bg-card border border-border/30 rounded-xl overflow-hidden shadow-lg">
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
            
            {/* Search Bar */}
            <div className="relative left-5 flex items-center max-w-xl">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search gyms by name, location, or features..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 pl-5 pr-12 rounded-full border-0 shadow-lg text-gray-800 focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 text-gray-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-12 -mt-12 relative z-20">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar snap-x">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium snap-start ${
                activeCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-card hover:bg-gray-200 dark:hover:bg-gray-700 text-text"
              } transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Featured Gyms
        {featuredGyms.length > 0 && !searchQuery && province === "All" && activeCategory === "All" && (
          <motion.div 
            className="mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center mb-4">
              <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-xl md:text-2xl font-bold text-text">Featured Gyms</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGyms.map((gym) => (
                <motion.div 
                  key={gym._id}
                  className="relative group rounded-xl overflow-hidden shadow-lg border border-border/30 bg-card hover:shadow-xl transition-all duration-300 cursor-pointer"
                  variants={itemVariants}
                  onClick={() => navigate(`/gym/${gym._id}`)}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 z-10 m-3">
                    <span className="bg-yellow-500 text-white text-xs uppercase font-bold rounded-full px-3 py-1 flex items-center">
                      <StarIcon className="w-3 h-3 mr-1" /> Featured
                    </span>
                  </div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={gym.gym_image_url ? gym.gym_image_url : new URL("../../assets/images/muaythai-001.jpg", import.meta.url).href}
                      alt={gym.gym_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text mb-1">{gym.gym_name}</h3>
                    
                    <div className="flex items-center text-sm text-text/70 mb-3">
                      <MapPinIcon className="w-4 h-4 flex-shrink-0 mr-1" />
                      <span>{gym.address?.district}, {gym.address?.province}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`w-4 h-4 ${i < (gym.rating || 4.5) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium">{gym.rating || 4.5}</span>
                      </div>
                      
                      <div className="text-sm font-medium text-primary">
                        View Details →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )} */}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel for Desktop */}
          <motion.div 
            className={`hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 overflow-hidden flex-shrink-0 transition-all duration-300 ${
              isFilterExpanded ? "lg:w-80" : "lg:w-72"
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-primary text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filter Gyms</h3>
                <button onClick={handleClearFilters} className="text-sm underline hover:text-white/80">
                  Clear All
                </button>
              </div>  
            </div>
            
            <div className="p-5">
              <GymFilter
                province={province}
                handleProvinceSelect={handleProvinceSelect}
                provinceData={provinceData}
              />
              
              {/* Additional filter options */}
              {/* <div className="mt-6">
                <h4 className="text-sm font-semibold text-text mb-2">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center text-text">
                        {rating}
                        <span className="flex ml-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>  
              </div> */}
              
              {/* <div className="mt-6">
                <h4 className="text-sm font-semibold text-text mb-2">Facilities</h4>
                <div className="space-y-2">
                  {["Air Conditioning", "Shower", "Locker", "Parking", "Free Trial"].map((facility) => (
                    <div key={facility} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`facility-${facility.replace(/\s+/g, '-').toLowerCase()}`}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`facility-${facility.replace(/\s+/g, '-').toLowerCase()}`} 
                        className="ml-2 text-text"
                      >
                        // {facility}
                      </label>
                    </div>
                  ))}
                </div>
              </div> */}
              
              {/* <div className="mt-6">
                <h4 className="text-sm font-semibold text-text mb-2">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    className="w-full accent-primary"
                  />
                </div>
                <div className="flex justify-between mt-1 text-sm text-text/70">
                  <span>฿0</span>
                  <span>฿10,000+</span>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Stats and Controls for results */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <FireIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-bold text-text">
                  {isLoading 
                    ? "Finding gyms..."
                    : filteredGyms.length > 0 
                      ? `${filteredGyms.length} Gyms ${province !== "All" ? `in ${province}` : "Found"}`
                      : "No gyms matching your criteria"
                  }
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Active filters display */}
                {(province !== "All" || activeCategory !== "All" || searchQuery) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {province !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Location: {province}
                        <button 
                          onClick={() => setProvince("All")}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                    
                    {activeCategory !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {activeCategory}
                        <button 
                          onClick={() => setActiveCategory("All")}
                          className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                    
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        Search: {searchQuery}
                        <button 
                          onClick={() => {
                            setSearchQuery("");
                            if (searchInputRef.current) {
                              searchInputRef.current.value = "";
                            }
                          }}
                          className="ml-1 text-amber-600 hover:text-amber-800 dark:text-amber-400"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                  </div>
                )}
                
                {/* Sort dropdown */}
                <select className="py-2 px-3 rounded-lg border border-border text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Sort by: Recommended</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                
                {/* Filter button for mobile */}
                <button
                  onClick={toggleFilterModal}
                  className="lg:hidden bg-primary hover:bg-secondary text-white flex items-center gap-2 rounded-lg py-2 px-4 transition-colors"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Gym List */}
            {isLoading ? (
              renderSkeletonCards()
            ) : filteredGyms.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <GymCard gyms={filteredGyms.slice(0, visibleGyms)} />
                
                {/* Load More button */}
                {filteredGyms.length > visibleGyms && (
                  <div className="flex justify-center mt-10">
                    <motion.button
                      onClick={loadMoreGyms}
                      className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Load More Gyms
                    </motion.button>
                  </div>
                )}
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

        {/* Add Gym button for gym owners */}
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