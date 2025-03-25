import { useNavigate } from "react-router-dom";

function EventCard({ events }) {  // Added events as a prop
  const navigate = useNavigate();

  const handleEventClick = (event) => {
    console.log("navigate to:", `/event/${event._id}`);

    // Convert dates to proper format
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
      case "Rookie":
        return "text-green-500";
      case "Fighter":
        return "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  // If no events provided, return null or a placeholder
  if (!events || !Array.isArray(events) || events.length === 0) {
    return <div>No events available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {events.map((event) => (
        <button
          key={event._id}
          className={`max-w-xs rounded-lg overflow-hidden bg-card text-text cursor-pointer transition transform hover:scale-105 
                      shadow-xl hover:shadow-2xl border border-opacity-10 border-gray-300 dark:border-gray-600`}
          onClick={() => handleEventClick(event)}
        >
          <div className="w-full aspect-[4/3] relative">
            <img
              className="w-full h-full object-cover"
              src={event.poster_url || "/default-event-image.jpg"}  // Use poster_url from your data
              alt={event.event_name}
              onError={(e) => { e.target.src = "/default-event-image.jpg" }} // Fallback image
            />
          </div>
          <div className="px-6 py-2">
            <div className="text-base mb-1 text-text font-semibold">
              {event.event_name || "Unnamed Event"}
            </div>
            <div className={`font-normal ${getLevelColor(event.level)}`}>
              {event.level || "Unknown Level"}
            </div>
            <div className="flex items-center font-base text-sm mb-1">
              <span className="mr-2">{formatDate(event.start_date)}</span>
              <span className="mr-2">-</span>
              <span className="mr-2">{formatDate(event.end_date)}</span>
            </div>
            {/* Additional info from your data */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Status: {event.status}
            </div>
            {event.seat_zones?.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Starting at: ฿{Math.min(...event.seat_zones.map(zone => zone.price)).toLocaleString()}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default EventCard;