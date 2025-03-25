import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, TicketIcon, UserGroupIcon, CalendarIcon, FireIcon, ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getEvents } from "../../services/api/EventApi";
import EventCard from "../../components/EventCard";
import EventFilter from "../../components/events/EventFilter"; // Add the import
import proviceData from "../../data/thailand/address/provinces.json";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getEvents();
        console.log(response.data);
        
        const eventsArray = Array.isArray(response) ? response : response?.data || [];
        setEvents(eventsArray);
        console.log("event: ", response.data);
        
        setFilteredEvents(eventsArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];
    
    if (province !== "All") {
      filtered = filtered.filter(event => event.location?.province === province);
    }
    
    if (activeEventType !== "All") {
      filtered = filtered.filter(event => event.event_type === activeEventType);
    }
    
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

  const registrationEvents = Array.isArray(filteredEvents)
    ? filteredEvents.filter(event => event.event_type === "Registration")
    : [];
  const ticketSaleEvents = Array.isArray(filteredEvents)
    ? filteredEvents.filter(event => event.event_type === "TicketSale")
    : [];
  const featuredEvents = Array.isArray(events)
    ? events.filter(event => event.featured)
    : [];

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
                        {new Date(event.start_date).toLocaleDateString()} 
                        {new Date(event.start_date).toDateString() !== new Date(event.end_date).toDateString() && 
                          ` - ${new Date(event.end_date).toLocaleDateString()}`}
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Panel */}
          <motion.div 
            className="hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 overflow-hidden flex-shrink-0 h-fit sticky top-28"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-primary text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filter Events</h3>
                <button onClick={handleClearFilters} className="text-sm underline hover:text-white/80">
                  Clear All
                </button>
              </div>  
            </div>
            
            <div className="p-5">
              <EventFilter province={province} handleProvinceSelect={handleProvinceSelect} />
            </div>
          </motion.div>

          {/* Main Events Display */}
          <div className="flex-grow" id="all-events">
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
                {(province !== "All" || activeEventType !== "All" || searchQuery) && (
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
                    
                    {activeEventType !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {activeEventType === "TicketSale" ? "Fight Nights" : "Tournaments"}
                        <button 
                          onClick={() => setActiveEventType("All")}
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
                          onClick={() => setSearchQuery("")}
                          className="ml-1 text-amber-600 hover:text-amber-800 dark:text-amber-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
                
                <select className="py-2 px-3 rounded-lg border border-border text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Sort by: Upcoming</option>
                  <option>Date: Earliest First</option>
                  <option>Date: Latest First</option>
                  <option>Name: A-Z</option>
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
                <EventCard events={registrationEvents.slice(0, visibleEvents)} />
              </motion.div>
            )}

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
                <EventCard events={ticketSaleEvents.slice(0, visibleEvents)} />
              </motion.div>
            )}
            
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
            
            {isLoading && renderSkeletonCards()}

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

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter Events</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                ×
              </button>
            </div>
            
            <EventFilter province={province} handleProvinceSelect={handleProvinceSelect} />
            
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