import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TicketSale from "./TypeEvent/TicketSale";
import Registration from "./TypeEvent/Registration";
import { LucideMapPin } from "lucide-react";
import { Navigate } from "react-router-dom";
function EventDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState(location.state?.event || null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!event) {
      console.log("Fetching event from API...");
      const fetchEventById = async () => {
        try {
          const response = await fetch(`/api/events/${id}`);
          if (!response.ok) throw new Error("Failed to fetch event");
          let data = await response.json();

          // 🔥 แปลง start_date เป็น string ถ้ามันเป็น `Date` object
          data.start_date =
            data.start_date instanceof Date
              ? data.start_date.toISOString()
              : data.start_date;
          data.end_date =
            data.end_date instanceof Date
              ? data.end_date.toISOString()
              : data.end_date;

          setEvent(data);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEventById();
    }
  }, [id]);

  // 🛠 ป้องกัน event เป็น `null`
  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="grid grid-rows-2 gap-2">
        <div className="grid grid-cols-3 gap-4 p-1 rounded-lg">
          <div className="justify-center flex rounded-lg w-full">
            <img
              src={event.image_url}
              alt={event.event_name}
              className="w-full max-w-2xl rounded-lg"
            />
          </div>
          <div className="rounded-lg"></div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-1  rounded-lg">
          <div className="text-center rounded-lg"></div>
          <div className="rounded-lg p-4">
            <h1 className="font-semibold text-4xl">Deatail</h1>
            <div className="mt-2 w-full h-32 rounded-md bg-gray-300 dark:bg-gray-600 items-center flex justify-center">
              <span>Detail</span>
            </div>
            <div className="mt-2 rounded-md flex gap-1">
              <span className="text-3xl font-semibold">Map</span>
              <LucideMapPin className="h-8 w-8 " />
            </div>
            <div className="mt-2 w-full h-60 rounded-sm bg-gray-300  dark:bg-gray-600 flex justify-center items-center">
              <span>Map</span>
            </div>
          </div>

          <div className="text-center rounded-lg">
            {event.event_type === "TicketSale" ? (
              <TicketSale event={event} />
            ) : (
              <Registration event={event} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
