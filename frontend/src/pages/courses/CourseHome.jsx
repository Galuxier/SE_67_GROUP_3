import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, FireIcon, CalendarIcon, UsersIcon, AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { searchCourses } from "../../services/api/CourseApi";
import CourseList from "../../components/CourseCard";
import provinceData from "../../data/thailand/address/provinces.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import CourseFilter from "../../components/courses/CourseFilter";

function CourseHome() {
  const navigate = useNavigate();
  const [province, setProvince] = useState("All");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(15);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const categories = ["All", "for_kid", "beginner", "advance"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const params = {
          query: searchQuery,
          province: province !== "All" ? province : undefined,
          level: activeCategory !== "All" ? activeCategory : undefined,
          sort: sortOption,
          page: currentPage,
          limit: 15
        };

        const response = await searchCourses(params);
        const coursesArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setCourses(coursesArray);
        setFilteredCourses(coursesArray);
        setTotalCourses(response.data?.pagination?.total || coursesArray.length);
        
        const featured = coursesArray.filter(course => course.featured);
        setFeaturedCourses(featured);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [province, searchQuery, activeCategory, sortOption, currentPage]);

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const loadMoreCourses = () => {
    setCurrentPage(prev => prev + 1);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilters = () => {
    setProvince("All");
    setSearchQuery("");
    setActiveCategory("All");
    setSortOption("latest");
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

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

  const getLevelBadgeColor = (level) => {
    switch(level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "advance":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "for_kid":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const toTitleCase = (str) => {
    if (!str || str === "All") return str;
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="relative w-full h-[40vh] md:h-40vh] z-0 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              Find Your Perfect <span className="text-yellow-300">Muay Thai Course</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              Discover authentic training taught by champions and master trainers across Thailand
            </p>
            <div className="relative flex items-center max-w-xl">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search for courses, techniques, or locations..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 pl-5 pr-12 rounded-full border-0 shadow-lg text-gray-800 focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-12 -mt-0 relative z-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar snap-x bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-sm">
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
              {toTitleCase(category)}
            </motion.button>
          ))}
        </div>

        {featuredCourses.length > 0 && !searchQuery && province === "All" && activeCategory === "All" && (
          <motion.div 
            className="mb-12 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-900/20 dark:to-rose-900/20 p-6 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <SparklesIcon className="w-6 h-6 text-amber-500 mr-2" />
              <h2 className="text-2xl font-bold text-text">Featured Courses</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.slice(0, 3).map((course) => (
                <motion.div 
                  key={course.id}
                  className="relative group rounded-xl overflow-hidden shadow-lg border border-amber-200 dark:border-amber-800/50 bg-white dark:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/course/${course.id}`)}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 z-10 m-3">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs uppercase font-bold rounded-full px-3 py-1 flex items-center shadow-md">
                      <SparklesIcon className="w-3 h-3 mr-1" /> Featured
                    </span>
                  </div>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image_url}
                      alt={course.course_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-text mb-1">{course.course_name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getLevelBadgeColor(course.level)}`}>
                        {toTitleCase(course.level)}
                      </span>
                      <span className="text-primary font-semibold">฿{course.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-text/70 mb-4">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text/70">
                        <span className="font-medium text-primary">{course.spots_left}</span> spots left
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
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div 
            className="hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 overflow-hidden flex-shrink-0 h-fit sticky top-28"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-gradient-to-r from-primary to-secondary text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filter Courses</h3>
                <button onClick={handleClearFilters} className="text-sm underline hover:text-white/80">
                  Clear All
                </button>
              </div>
            </div>
            <div className="p-5">
              <CourseFilter
                province={province}
                handleProvinceSelect={handleProvinceSelect}
                provinceData={provinceData}
              />
            </div>
          </motion.div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <FireIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-bold text-text">
                  {isLoading 
                    ? "Finding courses..."
                    : filteredCourses.length > 0 
                      ? `${totalCourses} Courses ${province !== "All" ? `in ${province}` : "Found"}`
                      : "No courses matching your criteria"
                  }
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {(province !== "All" || activeCategory !== "All" || searchQuery) && (
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
                    {activeCategory !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {toTitleCase(activeCategory)}
                        <button 
                          onClick={() => setActiveCategory("All")}
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
                  className="py-2 px-3 rounded-lg border border-border text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
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
            ) : filteredCourses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CourseList courses={filteredCourses} />
                {filteredCourses.length < totalCourses && (
                  <div className="flex justify-center mt-10">
                    <motion.button
                      onClick={loadMoreCourses}
                      className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Load More Courses
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-text">No courses found</h3>
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
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter Courses</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                ×
              </button>
            </div>
            <CourseFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            />
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-border text-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Clear All
              </button>
              <button
                onClick={toggleFilterModal}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseHome;