import { Link } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
// import { getAllEvents } from "../../services/api/EventApi";
import EventCard from "../../components/EventCard";
import provinceData from "../../data/thailand/address/provinces.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
// import EventFilter from "../../components/events/EventFilter";

function EventHome() {
  const [province, setProvince] = useState("All");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(30);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await getAllEvents();
  //       setEvents(response);
  //       setFilteredEvents(response);
  //     } catch (error) {
  //       console.error("Failed to fetch events:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  useEffect(() => {
    filterEventsByProvince(province);
  }, [province]);

  const filterEventsByProvince = (provinceName) => {
    if (provinceName === "All") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) => event.address.province === provinceName
      );
      setFilteredEvents(filtered);
    }
  };

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
  };

  const loadMoreEvents = () => {
    setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 30);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="container px-5 sm:px-0 pb-5 pt-5 mx-auto">
        {/* Header */}
        <div className="flex justify-center relative mb-6">
          {user?.role?.includes("event_organizer") && (
            <Link to="/event/addEvent">
              <button className="bg-secondary hover:bg-primary rounded-full w-8 h-8 flex items-center justify-center absolute right-0">
                <PlusCircleIcon className="h-10 w-10 text-white" />
              </button>
            </Link>
          )}
        </div>

        {/* Sidebar and EventList */}
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
            {/* <EventFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            /> */}
          </div>

          {/* EventList */}
          <div className="flex-grow">
            <EventCard events={filteredEvents.slice(0, visibleEvents)} />
            {filteredEvents.length > visibleEvents && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreEvents}
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
            {/* <EventFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventHome;