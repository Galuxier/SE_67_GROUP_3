import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { LucideMapPin } from "lucide-react";
import { getImage } from "../../services/api/ImageApi";
import { useAuth } from "../../context/AuthContext";

// Event Type Components
const TicketSale = ({ event, navigate }) => {
  const user = useAuth();
  
  return (
    <div className="p-6 text-center">
      <h2 className="font-semibold text-2xl mb-4 text-text">Ticket Price</h2>

      {/* Seat Zone Price List */}
      <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-2">
        {event.seat_zones?.map((zone, index) => (
          <div
            key={index}
            className="flex items-center justify-around py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center text-text">
              <div
                className={`w-5 h-5 rounded-full mr-3 ${
                  index === 0
                    ? "bg-purple-500"
                    : index === 1
                    ? "bg-blue-500"
                    : index === 2
                    ? "bg-orange-500"
                    : index === 3
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span>{zone.zone_name}</span>
            </div>
            <span className="text-text">{zone.price.toLocaleString()} THB</span>
            {/* <button className="text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button> */}
          </div>
        ))}
      </div>

      {/* Buy Button */}
      <button 
        onClick={() => {
          if (user.isLoggedIn) {
            navigate(`/event/${event._id}/ticket`, { state: { event } });
          } else {
            navigate("/login");
          }
        }}
       className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg">
        Buy Tickets
      </button>
    </div>
  );
};

const Registration = ({ event, navigate }) => {
  const user = useAuth();
  return (
    <div className="p-6 text-center">
      <h2 className="font-semibold text-2xl mb-4 text-text">Weight Categories</h2>

      {/* Weight Class List */}
      <div className="text-left text-text space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-2">
        {event.weight_classes?.map((weight, index) => (
          <div
            key={index}
            className="flex items-center py-3 border-b border-gray-100 last:border-0"
          >
            <span className="mr-2">{index + 1}.</span>
            <span>{weight.weigh_name}</span>
          </div>
        ))}
      </div>

      {/* Registration Info */}
      <div className="mt-6 text-left">
        <h3 className="font-semibold text-xl mb-2 text-text">Registration Fee</h3>
        <p className="text-gray-700 text-text">No fee required</p>
      </div>

      {/* Register Button */}
      <button
        onClick={() => {
          if (user.isLoggedIn) {
            navigate(`/event/${event._id}/register`, { state: { event } });
          } else {
            navigate("/login");
          }
        }}
        className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        Register Now
      </button>

    </div>
  );
};

function EventDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(location.state?.event || null);
  
  

  useEffect(() => {
    if (!event) {
      console.log("Fetching event from API...");
      const fetchEventById = async () => {
        try {
          const response = await fetch(`/api/events/${id}`);
          console.log(`/api/events/${id}`);
          
          if (!response.ok) throw new Error("Failed to fetch event");
          let data = await response.json();

          // Format dates if needed
          data.start_date =
            data.start_date instanceof Date
              ? data.start_date.toISOString()
              : data.start_date;
          data.end_date =
            data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date;

          setEvent(data);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEventById();
    }
  }, [id, event]);

  const handleBack = () => navigate(-1);

  // Show loading state if event data isn't loaded yet
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [imageUrl, setImageUrl] = useState(null);
  const [seatZoneUrl, setSeatZoneUrl] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      const url = await getImage(event.poster_url);
      setImageUrl(url); // Update state
      const seat_url = await getImage(event.seatZone_url);
      setSeatZoneUrl(seat_url); // Update state
      // console.log(seat_url);
      
    }
    fetchImage();
  }, [event.poster_url]); // Run when poster_url changes

  console.log(event);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 ">
      {/* Event Header */}
      <div className="mb-6 max-w-6xl mx-auto mt-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-text">{event.event_name}</h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto text-text">
        {/* Left Column - Event Poster */}
        <div className="md:col-span-3">
          <img
            src={imageUrl}
            alt={event.event_name}
            className="w-full h-auto rounded-lg shadow-md"
          />

          {/* Detail Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Event Details</h2>
            <div className="prose dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300">
                {event.description || ""}
              </p>
              <p className="mt-4">
                <strong>Dates:</strong> {formatDate(event.start_date)} - {formatDate(event.end_date)}
              </p>
              <p>
                <strong>Level:</strong> {event.level}
              </p>
            </div>
          </div>

          {/* Location Section */}
          {/* <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Location</h2>
              <LucideMapPin className="ml-2 h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Map will be displayed here</span>
            </div>
          </div> */}
        </div>

        {/* Right Column - Seating Chart and Pricing/Registration */}
        <div className="md:col-span-2 space-y-8 md:sticky md:top-20 self-start">
          {/* Seating Chart */}
          {event.event_type === "ticket_sales" && seatZoneUrl && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <img
                src={seatZoneUrl}
                alt="Seating Chart"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Pricing or Registration Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {event.event_type === "ticket_sales" ? (
              <TicketSale event={event} navigate={navigate} />
            ) : (
              <Registration event={event} navigate={navigate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
