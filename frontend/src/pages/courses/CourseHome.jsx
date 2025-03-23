import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, FireIcon, CalendarIcon, UsersIcon, AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
// import { getAllCourses } from "../../services/api/CourseApi"; 
import CourseCard from "../../components/CourseCard";
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
  const [visibleCourses, setVisibleCourses] = useState(30);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Categories for quick filtering
  const categories = ["All", "Beginner", "Intermediate", "Advanced", "For Kids", "Private"];

  // Fetch courses data
  useEffect(() => {
    // Mock data for development
    const mockCourses = [
      {
        id: 1,
        course_name: "Fundamentals of Muay Thai",
        image_url: new URL("../../assets/images/muaythai-001.jpg", import.meta.url).href,
        level: "Beginner",
        price: 2000,
        location: { province: "Bangkok", district: "Pathumwan" },
        description: "Master the basics of Muay Thai with expert trainers in a welcoming environment",
        featured: true,
        start_date: "2025-04-15",
        end_date: "2025-05-30",
        spots_left: 8
      },
      {
        id: 2,
        course_name: "Advanced Clinch Techniques",
        image_url: new URL("../../assets/images/muaythai-002.jpg", import.meta.url).href,
        level: "Advanced",
        price: 3500,
        location: { province: "Phuket", district: "Kathu" },
        description: "Deep dive into professional clinch techniques used in championship fights",
        featured: true,
        start_date: "2025-04-20",
        end_date: "2025-06-10",
        spots_left: 4
      },
      {
        id: 3,
        course_name: "Kids Muay Thai (Ages 7-12)",
        image_url: new URL("../../assets/images/muaythai-003.png", import.meta.url).href,
        level: "For Kids",
        price: 1800,
        location: { province: "Chiang Mai", district: "Mueang" },
        description: "Fun, safe introduction to Muay Thai basics for children",
        featured: false,
        start_date: "2025-05-01",
        end_date: "2025-06-30",
        spots_left: 10
      },
      {
        id: 4,
        course_name: "Competition Preparation",
        image_url: new URL("../../assets/images/muaythai-001.jpg", import.meta.url).href,
        level: "Advanced",
        price: 4500,
        location: { province: "Bangkok", district: "Watthana" },
        description: "Intensive training program for fighters preparing for competition",
        featured: false,
        start_date: "2025-05-10",
        end_date: "2025-07-10",
        spots_left: 6
      },
      {
        id: 5,
        course_name: "One-on-One Training",
        image_url: new URL("../../assets/images/muaythai-002.jpg", import.meta.url).href,
        level: "Private",
        price: 5000,
        location: { province: "Phuket", district: "Kathu" },
        description: "Personalized training sessions with championship fighters",
        featured: true,
        start_date: "Flexible",
        end_date: "Flexible",
        spots_left: 3
      },
      {
        id: 6,
        course_name: "Intermediate Techniques",
        image_url: new URL("../../assets/images/muaythai-003.png", import.meta.url).href,
        level: "Intermediate",
        price: 2800,
        location: { province: "Bangkok", district: "Bang Kapi" },
        description: "Progress your skills with advanced combinations and defense tactics",
        featured: false,
        start_date: "2025-04-25",
        end_date: "2025-06-15",
        spots_left: 7
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      
      // Set featured courses
      const featured = mockCourses.filter(course => course.featured);
      setFeaturedCourses(featured);
      
      setIsLoading(false);
    }, 800);
    
    // In a real app, you would use this:
    // const fetchCourses = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await getAllCourses();
    //     setCourses(response);
    //     setFilteredCourses(response);
    //     
    //     // Set featured courses
    //     const featured = response.filter(course => course.featured);
    //     setFeaturedCourses(featured);
    //     
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.error("Failed to fetch courses:", error);
    //     setIsLoading(false);
    //   }
    // };
    // fetchCourses();
  }, []);

  // Apply all filters: province, search query, and category
  useEffect(() => {
    let filtered = [...courses];
    
    // Filter by province
    if (province !== "All") {
      filtered = filtered.filter(course => course.location?.province === province);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.course_name?.toLowerCase().includes(query) || 
        course.description?.toLowerCase().includes(query) ||
        course.location?.district?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category (level)
    if (activeCategory !== "All") {
      filtered = filtered.filter(course => course.level === activeCategory);
    }
    
    setFilteredCourses(filtered);
  }, [province, searchQuery, activeCategory, courses]);

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const loadMoreCourses = () => {
    setVisibleCourses((prevVisibleCourses) => prevVisibleCourses + 30);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilters = () => {
    setProvince("All");
    setSearchQuery("");
    setActiveCategory("All");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
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

  // Get level badge color
  const getLevelBadgeColor = (level) => {
    switch(level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "For Kids":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Private":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Simplified Hero Banner - Similar to GymHome */}
      <div className="relative w-full h-[40vh] md:h-[50vh] z-0 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect <span className="text-yellow-300">Muay Thai Course</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              Discover authentic training taught by champions and master trainers across Thailand
            </p>
            
            {/* Search Bar */}
            <div className="relative flex items-center max-w-xl">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search for courses, techniques, or locations..."
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
        
        {/* Courses stats bar - shows at the bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm p-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-2">
                <div className="flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg font-bold text-white">{courses.length}+ Courses</span>
                </div>
                <p className="text-white/70 text-xs">Available across Thailand</p>
              </div>
              
              <div className="text-center p-2">
                <div className="flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg font-bold text-white">50+ Trainers</span>
                </div>
                <p className="text-white/70 text-xs">Championship fighters & masters</p>
              </div>
              
              <div className="text-center p-2">
                <div className="flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg font-bold text-white">Flexible Schedules</span>
                </div>
                <p className="text-white/70 text-xs">Morning, evening & weekend classes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-12 -mt-0 relative z-20">
        {/* Category Pills */}
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
              {category}
            </motion.button>
          ))}
        </div>
  
        {/* Featured Courses */}
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
              {featuredCourses.map((course) => (
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
                        {course.level}
                      </span>
                      <span className="text-primary font-semibold">฿{course.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-text/70 mb-4">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{course.start_date} - {course.end_date}</span>
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
  
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel for Desktop */}
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
              
              {/* Level Filter */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-text mb-2">Level</h4>
                <div className="space-y-2">
                  {categories.filter(cat => cat !== "All").map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        type="radio"
                        id={`level-${level}`}
                        checked={activeCategory === level}
                        onChange={() => handleCategorySelect(level)}
                        className="rounded-full text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`level-${level}`} 
                        className={`ml-2 text-text ${activeCategory === level ? 'font-medium' : ''}`}
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>  
              </div>
              
              {/* Price Range */}
              <div className="mt-6">
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
              </div>
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
                    ? "Finding courses..."
                    : filteredCourses.length > 0 
                      ? `${filteredCourses.length} Courses ${province !== "All" ? `in ${province}` : "Found"}`
                      : "No courses matching your criteria"
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
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Start Date: Earliest</option>
                  <option>Start Date: Latest</option>
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
  
            {/* Course List */}
            {isLoading ? (
              renderSkeletonCards()
            ) : filteredCourses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CourseCard courses={filteredCourses.slice(0, visibleCourses)} />
                
                {/* Load More button */}
                {filteredCourses.length > visibleCourses && (
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
  
      {/* Add Course button for gym owners and trainers */}
      {user && user.role && (user.role.includes("gym_owner") || user.role.includes("trainer")) && (
        <motion.div 
          className="fixed bottom-6 right-6 z-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        >
          <Link
            to="/course/create"
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add New Course</span>
          </Link>
        </motion.div>
      )}
  
      {/* Modal for Filter on Mobile */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter Courses</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                &times;
              </button>
            </div>
            
            <CourseFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            />
            
            {/* Level Filter for Mobile */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-text mb-2">Level</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.filter(cat => cat !== "All").map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-level-${level}`}
                      checked={activeCategory === level}
                      onChange={() => handleCategorySelect(level)}
                      className="rounded-full text-primary focus:ring-primary"
                    />
                    <label 
                      htmlFor={`mobile-level-${level}`} 
                      className={`ml-2 text-text ${activeCategory === level ? 'font-medium' : ''}`}
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range for Mobile */}
            <div className="mt-6">
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
            </div>
            
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