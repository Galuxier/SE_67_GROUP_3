import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getImage } from "../services/api/ImageApi";

function EventCard({ events }) {
  const navigate = useNavigate();

  const handleEventClick = (event) => {
    console.log("navigate to:", `/event/${event._id}`);
    const eventData = {
      ...event,
      start_date: new Date(event.start_date).toISOString().split("T")[0],
      end_date: new Date(event.end_date).toISOString().split("T")[0],
    };

    navigate(`/event/${event._id}`, { state: { event: eventData } });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString("en-GB", { 
      day: "2-digit", 
      month: "short",
      year: "numeric"
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "text-green-500";
      case "fighter":
        return "text-rose-500";
      default:
        return "text-gray-700";
    }
  };

  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    async function fetchImages() {
      const urls = {};
      for (const event of events) {
        const url = await getImage(event.poster_url); // Ensure the url is valid
        if (url) {
          urls[event._id] = url; // Use event._id as key
        } else {
          urls[event._id] = "/default-event-image.jpg"; // Fallback if no image
        }
      }
      setImageUrls(urls);
    }

    if (events && events.length) {
      fetchImages();
    }
  }, [events]);

  if (!events || !Array.isArray(events) || events.length === 0) {
    return <div>No events available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {events.map((event) => (
      <button
        key={event._id}
        className={`max-w-xs rounded-lg overflow-hidden bg-white text-text cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl 
                    shadow-md border border-opacity-10 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
        onClick={() => handleEventClick(event)}
      >
        {/* Image section */}
        <div className="w-full aspect-[4/3] relative">
          <img
            className="w-full h-full object-cover rounded-t-lg"
            src={imageUrls[event._id]} // Ensure this points to a valid URL
            alt={event.event_name}
            onError={(e) => { e.target.src = "/default-event-image.jpg" }} // Fallback image
          />
        </div>
  
        {/* Event info section */}
        <div className="px-6 py-4">
          {/* Event Name */}
          <div className="text-lg font-semibold text-primary dark:text-primary-light mb-2">
            {event.event_name || "Unnamed Event"}
          </div>
  
          {/* Event Level */}
          <div className={`font-normal ${getLevelColor(event.level)} mb-2`}>
            {event.level || "Unknown Level"}
          </div>
  
          {/* Event Date */}
          <div className="flex flex-row justify-center items-center font-base text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="mr-2">{formatDate(event.start_date)}</span>
            <span className="mr-2">-</span>
            <span className="mr-2">{formatDate(event.end_date)}</span>
          </div>
  
          {/* Event Status */}
          <div className="text-sm text-gray-700 dark:text-gray-400 mb-2">
            Status: <span className="font-semibold">{event.status}</span>
          </div>
  
          {/* Event Price */}
          {event.seat_zones?.length > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-400 mt-1">
              Starting at: à¸¿{Math.min(...event.seat_zones.map(zone => zone.price)).toLocaleString()}
            </div>
          )}
        </div>
      </button>
    ))}
  </div>
  
  );
}

export default EventCard;