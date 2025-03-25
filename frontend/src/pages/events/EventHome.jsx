import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, TicketIcon, UserGroupIcon, CalendarIcon, FireIcon, ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
// import { getAllEvents } from "../../services/api/EventApi";
import EventCard from "../../components/EventCard";
import provinceData from "../../data/thailand/address/provinces.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
// import EventFilter from "../../components/events/EventFilter";
import { Navigate } from "react-router-dom";

function EventHome() {
  const [province, setProvince] = useState("All");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(30);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEventType, setActiveEventType] = useState("All");
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Mock events data
  const mockEvents = [
    {
      _id: "1",
      image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
      event_name: "Bangkok Championship 2025",
      level: "Rookie",
      start_date: new Date("2025-04-15"),
      end_date: new Date("2025-04-21"),
      event_type: "Registration",
      status: "preparing",
      location: { province: "Bangkok", district: "Pathumwan" },
      featured: true,
      weight_classes: [
        {
          type: "lightweight",
          weigh_name: "Lightweight",
          min_weight: 50,
          max_weight: 60,
        },
        {
          type: "middleweight",
          weigh_name: "Middleweight",
          min_weight: 61,
          max_weight: 70,
        },
      ],
    },
    {
      _id: "2",
      image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href,
      event_name: "Muay Thai Grand Prix",
      level: "Fighter",
      start_date: new Date("2025-05-10"),
      end_date: new Date("2025-05-11"),
      event_type: "TicketSale",
      status: "preparing",
      location: { province: "Chiang Mai", district: "Mueang" },
      featured: true,
      seat_zones: [
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da01",
          zone_name: "VIP",
          price: 5000,
          number_of_seat: 50,
        },
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da02",
          zone_name: "Standard",
          price: 1000,
          number_of_seat: 200,
        },
      ],
    },
    {
      _id: "3",
      image_url: new URL("../assets/images/muaythai-003.png", import.meta.url).href,
      event_name: "Phuket Fight Night",
      level: "Fighter",
      start_date: new Date("2025-06-05"),
      end_date: new Date("2025-06-05"),
      event_type: "TicketSale",
      status: "preparing",
      location: { province: "Phuket", district: "Patong" },
      featured: false,
      seat_zones: [
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da03",
          zone_name: "Ringside",
          price: 3000,
          number_of_seat: 30,
        },
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da04",
          zone_name: "General",
          price: 800,
          number_of_seat: 150,
        },
      ],
    },
    {
      _id: "4",
      image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
      event_name: "Northern Thailand Tournament",
      level: "Rookie",
      start_date: new Date("2025-04-28"),
      end_date: new Date("2025-05-02"),
      event_type: "Registration",
      status: "preparing",
      location: { province: "Chiang Rai", district: "Mueang" },
      featured: false,
      weight_classes: [
        {
          type: "lightweight",
          weigh_name: "Lightweight",
          min_weight: 50,
          max_weight: 60,
        },
        {
          type: "heavyweight",
          weigh_name: "Heavyweight",
          min_weight: 71,
          max_weight: 80,
        },
      ],
    },
    {
      _id: "5",
      image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href,
      event_name: "Lumpinee Stadium Fight Night",
      level: "Fighter",
      start_date: new Date("2025-05-22"),
      end_date: new Date("2025-05-22"),
      event_type: "TicketSale",
      status: "preparing",
      location: { province: "Bangkok", district: "Pathum Wan" },
      featured: true,
      seat_zones: [
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da05",
          zone_name: "VIP",
          price: 8000,
          number_of_seat: 20,
        },
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da06",
          zone_name: "Ringside",
          price: 3500,
          number_of_seat: 100,
        },
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da07",
          zone_name: "General",
          price: 1200,
          number_of_seat: 300,
        },
      ],
    },
    {
      _id: "6",
      image_url: new URL("../assets/images/muaythai-003.png", import.meta.url).href,
      event_name: "Pattaya Open Championship",
      level: "Rookie",
      start_date: new Date("2025-07-10"),
      end_date: new Date("2025-07-15"),
      event_type: "Registration",
      status: "preparing",
      location: { province: "Chonburi", district: "Pattaya" },
      featured: true,
      weight_classes: [
        {
          type: "featherweight",
          weigh_name: "Featherweight",
          min_weight: 45,
          max_weight: 55,
        },
        {
          type: "lightweight",
          weigh_name: "Lightweight",
          min_weight: 56,
          max_weight: 65,
        },
        {
          type: "middleweight",
          weigh_name: "Middleweight",
          min_weight: 66,
          max_weight: 75,
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 800);
    
    // For actual API implementation:
    // const fetchEvents = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await getAllEvents();
    //     setEvents(response);
    //     setFilteredEvents(response);
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.error("Failed to fetch events:", error);
    //     setIsLoading(false);
    //   }
    // };
    // fetchEvents();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let filtered = [...events];
    
    // Filter by province
    if (province !== "All") {
      filtered = filtered.filter(event => event.location?.province === province);
    }
    
    // Filter by event type
    if (activeEventType !== "All") {
      filtered = filtered.filter(event => event.event_type === activeEventType);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.event_name?.toLowerCase().includes(query) || 
        event.level?.toLowerCase().includes(query) ||
        event.location?.district?.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(filtered);
  }, [province, activeEventType, searchQuery, events]);

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
  };

  const handleEventTypeSelect = (type) => {
    setActiveEventType(type);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const loadMoreEvents = () => {
    setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 30);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilters = () => {
    setProvince("All");
    setActiveEventType("All");
    setSearchQuery("");
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

  // Group events by type
  const registrationEvents = filteredEvents.filter(event => event.event_type === "Registration");
  const ticketSaleEvents = filteredEvents.filter(event => event.event_type === "TicketSale");

  // Loading skeleton UI
  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill().map((_, index) => (
        <div key={index} className="animate-pulse bg-card border border-border/30 rounded-xl overflow-hidden shadow-md">
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

  // Feature events section (similar to feature courses in CourseHome)
  const featuredEvents = events.filter(event => event.featured);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Hero Banner */}
      <div className="relative w-full h-[50vh] bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Discover Muay Thai <span className="text-yellow-300">Events</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              From championship tournaments to professional fight nights - find your next Muay Thai experience
            </p>
            
            {/* Search Bar */}
            <div className="relative flex items-center max-w-xl">
              <input
                type="text"
                placeholder="Search events, locations, or categories..."
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
        
        {/* Event stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm p-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-2">
                <div className="flex items-center justify-center">
                  <TicketIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg font-bold text-white">{ticketSaleEvents.length}+ Fight Nights</span>
                </div>
                <p className="text-white/70 text-xs">Watch the pros in action</p>
              </div>
              
              <div className="text-center p-2">
                <div className="flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg font-bold text-white">{registrationEvents.length}+ Tournaments</span>
                </div>
                <p className="text-white/70 text-xs">Compete and test your skills</p>
              </div>
              
              <div className="text-center p-2">
                <div className="flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg font-bold text-white">All Year Round</span>
                </div>
                <p className="text-white/70 text-xs">Events across Thailand</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-12 relative z-20">
        {/* Event Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar snap-x bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-sm -mt-5">
          {["All", "TicketSale", "Registration"].map((type) => (
            <motion.button
              key={type}
              onClick={() => handleEventTypeSelect(type)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium snap-start flex items-center gap-2 ${
                activeEventType === type
                  ? "bg-primary text-white shadow-md"
                  : "bg-card hover:bg-gray-200 dark:hover:bg-gray-700 text-text"
              } transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type === "TicketSale" && <TicketIcon className="h-4 w-4" />}
              {type === "Registration" && <UserGroupIcon className="h-4 w-4" />}
              {type === "All" ? "All Events" : type === "TicketSale" ? "Fight Nights" : "Tournaments"}
            </motion.button>
          ))}
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && !searchQuery && province === "All" && activeEventType === "All" && (
          <motion.div 
            className="mb-12 bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 p-6 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <FireIcon className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-text">Featured Events</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <motion.div 
                  key={event._id}
                  className="relative group rounded-xl overflow-hidden shadow-lg border border-amber-200 dark:border-amber-800/50 bg-white dark:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/event/${event._id}`)}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 z-10 m-3">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs uppercase font-bold rounded-full px-3 py-1 flex items-center shadow-md">
                      <FireIcon className="w-3 h-3 mr-1" /> Featured
                    </span>
                  </div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image_url}
                      alt={event.event_name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    
                    {/* Event type badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${
                        event.event_type === "TicketSale" 
                          ? "bg-red-500" 
                          : "bg-blue-500"
                      }`}>
                        {event.event_type === "TicketSale" ? "Fight Night" : "Tournament"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text mb-1">{event.event_name}</h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.level === "Rookie" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}>
                        {event.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-text/70 mb-4">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>
                        {event.start_date.toLocaleDateString()} 
                        {event.start_date.toDateString() !== event.end_date.toDateString() && 
                          ` - ${event.end_date.toLocaleDateString()}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text/70 flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {event.location?.province || "Thailand"}
                      </div>
                      
                      <div className="text-sm font-medium text-primary">
                        View Details →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Link
                to="#all-events"
                className="inline-flex items-center text-primary hover:text-secondary transition-colors"
              >
                View all events <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Main Content with Filter and Events */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel for Desktop */}
          <motion.div 
            className="hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 overflow-hidden flex-shrink-0 h-fit sticky top-28"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-primary to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filter Events</h3>
                <button onClick={handleClearFilters} className="text-sm underline hover:text-white/80">
                  Clear All
                </button>
              </div>  
            </div>
            
            <div className="p-5">
              {/* Province Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">Province</label>
                <select
                  className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  value={province}
                  onChange={(e) => handleProvinceSelect(e.target.value)}
                >
                  <option value="All">All Provinces</option>
                  {provinceData
                    .sort((a, b) => a.provinceNameTh.localeCompare(b.provinceNameTh))
                    .map((province, index) => (
                      <option key={index} value={province.provinceNameTh}>
                        {province.provinceNameTh}
                      </option>
                    ))}
                </select>
              </div>
              
              {/* Event Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-2">Event Type</h4>
                <div className="space-y-2">
                  {[
                    { id: "All", label: "All Types" },
                    { id: "TicketSale", label: "Fight Nights", icon: <TicketIcon className="w-4 h-4 mr-2" /> },
                    { id: "Registration", label: "Tournaments", icon: <UserGroupIcon className="w-4 h-4 mr-2" /> }
                  ].map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`type-${type.id}`}
                        checked={activeEventType === type.id}
                        onChange={() => handleEventTypeSelect(type.id)}
                        className="rounded-full text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`type-${type.id}`} 
                        className={`ml-2 text-text flex items-center ${activeEventType === type.id ? 'font-medium' : ''}`}
                      >
                        {type.icon} {type.label}
                      </label>
                    </div>
                  ))}
                </div>  
              </div>
              
              {/* Level Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-2">Level</h4>
                <div className="space-y-2">
                  {["Rookie", "Fighter"].map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`level-${level}`}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label htmlFor={`level-${level}`} className="ml-2 text-text">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-2">Date Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-text/70 block mb-1">From</label>
                    <input 
                      type="date" 
                      className="w-full border border-border rounded-lg py-1.5 px-3 bg-background text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text/70 block mb-1">To</label>
                    <input 
                      type="date" 
                      className="w-full border border-border rounded-lg py-1.5 px-3 bg-background text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Events Display */}
          <div className="flex-grow" id="all-events">
            {/* Stats and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <FireIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-bold text-text">
                  {isLoading 
                    ? "Finding events..."
                    : filteredEvents.length > 0 
                      ? `${filteredEvents.length} Events ${province !== "All" ? `in ${province}` : "Found"}`
                      : "No events matching your criteria"
                  }
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Active filters display */}
                {(province !== "All" || activeEventType !== "All" || searchQuery) && (
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
                    
                    {activeEventType !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {activeEventType === "TicketSale" ? "Fight Nights" : "Tournaments"}
                        <button 
                          onClick={() => setActiveEventType("All")}
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
                          onClick={() => setSearchQuery("")}
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
                  <option>Sort by: Upcoming</option>
                  <option>Date: Earliest First</option>
                  <option>Date: Latest First</option>
                  <option>Name: A-Z</option>
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

            {/* Section for Tournament Events (Registration) */}
            {activeEventType !== "TicketSale" && registrationEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center mb-4">
                  <UserGroupIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-bold text-text">Tournaments</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registrationEvents.slice(0, visibleEvents).map((event) => (
                    <motion.div
                      key={event._id}
                      className="bg-card rounded-xl overflow-hidden shadow-md border border-border/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(`/event/${event._id}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.event_name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        
                        {/* Event level badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.level === "Rookie" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}>
                            {event.level}
                          </span>
                        </div>
                        
                        {/* Event type badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500 text-white">
                            Tournament
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-text mb-2">{event.event_name}</h3>
                        
                        <div className="flex items-center text-sm text-text/70 mb-2">
                          <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>
                            {event.start_date.toLocaleDateString()} 
                            {event.start_date.toDateString() !== event.end_date.toDateString() && 
                              ` - ${event.end_date.toLocaleDateString()}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-text/70 mb-3">
                          <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{event.location?.district}, {event.location?.province}</span>
                        </div>
                        
                        <div className="mt-3">
                          {/* Weight classes summary */}
                          <p className="text-sm text-text/80 mb-2">Weight Classes:</p>
                          <div className="flex flex-wrap gap-1">
                            {event.weight_classes?.map((weightClass, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-text/70 rounded-full"
                              >
                                {weightClass.weigh_name}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-3">
                          <span className="text-primary hover:text-secondary text-sm font-medium">
                            Register Now →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Section for Fight Night Events (TicketSale) */}
            {activeEventType !== "Registration" && ticketSaleEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center mb-4">
                  <TicketIcon className="w-5 h-5 text-red-500 mr-2" />
                  <h2 className="text-xl font-bold text-text">Fight Nights</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ticketSaleEvents.slice(0, visibleEvents).map((event) => (
                    <motion.div
                      key={event._id}
                      className="bg-card rounded-xl overflow-hidden shadow-md border border-border/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(`/event/${event._id}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.event_name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        
                        {/* Event level badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.level === "Rookie" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}>
                            {event.level}
                          </span>
                        </div>
                        
                        {/* Event type badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
                            Fight Night
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-text mb-2">{event.event_name}</h3>
                        
                        <div className="flex items-center text-sm text-text/70 mb-2">
                          <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>
                            {event.start_date.toLocaleDateString()} 
                            {event.start_date.toDateString() !== event.end_date.toDateString() && 
                              ` - ${event.end_date.toLocaleDateString()}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-text/70 mb-3">
                          <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{event.location?.district}, {event.location?.province}</span>
                        </div>
                        
                        <div className="mt-3">
                          {/* Ticket zones summary */}
                          <p className="text-sm text-text/80 mb-2">Tickets From:</p>
                          <div className="flex flex-wrap justify-between">
                            {/* Showing cheapest ticket price */}
                            {event.seat_zones && event.seat_zones.length > 0 && (
                              <div className="font-bold text-primary text-lg">
                                ฿{Math.min(...event.seat_zones.map(zone => zone.price)).toLocaleString()}
                              </div>
                            )}
                            <span className="text-primary hover:text-secondary text-sm font-medium">
                              Buy Tickets →
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* No Events Found Section */}
            {!isLoading && filteredEvents.length === 0 && (
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-text">No events found</h3>
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
            
            {/* Loading Skeleton */}
            {isLoading && renderSkeletonCards()}

            {/* Load More Button */}
            {!isLoading && filteredEvents.length > visibleEvents && (
              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={loadMoreEvents}
                  className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Load More Events
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event button for organizers and gym owners */}
      {user && user.role && (user.role.includes("organizer") || user.role.includes("gym_owner")) && (
        <motion.div 
          className="fixed bottom-6 right-6 z-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        >
          <Link
            to="/event/management/create"
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Create New Event</span>
          </Link>
        </motion.div>
      )}

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter Events</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                &times;
              </button>
            </div>
            
            {/* Mobile Province Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-2">Province</label>
              <select
                className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
                value={province}
                onChange={(e) => handleProvinceSelect(e.target.value)}
              >
                <option value="All">All Provinces</option>
                {provinceData
                  .sort((a, b) => a.provinceNameTh.localeCompare(b.provinceNameTh))
                  .map((province, index) => (
                    <option key={index} value={province.provinceNameTh}>
                      {province.provinceNameTh}
                    </option>
                  ))}
              </select>
            </div>
            
            {/* Mobile Event Type Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-text mb-2">Event Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "All", label: "All Types" },
                  { id: "TicketSale", label: "Fight Nights", icon: <TicketIcon className="w-4 h-4 mr-1" /> },
                  { id: "Registration", label: "Tournaments", icon: <UserGroupIcon className="w-4 h-4 mr-1" /> }
                ].map((type) => (
                  <div key={type.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-type-${type.id}`}
                      checked={activeEventType === type.id}
                      onChange={() => handleEventTypeSelect(type.id)}
                      className="rounded-full text-primary focus:ring-primary"
                    />
                    <label 
                      htmlFor={`mobile-type-${type.id}`} 
                      className={`ml-2 text-text flex items-center ${activeEventType === type.id ? 'font-medium' : ''}`}
                    >
                      {type.icon} {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Level Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-text mb-2">Level</h4>
              <div className="grid grid-cols-2 gap-2">
                {["Rookie", "Fighter"].map((level) => (
                  <div key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-level-${level}`}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor={`mobile-level-${level}`} className="ml-2 text-text">
                      {level}
                    </label>
                  </div>
                ))}
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

export default EventHome;