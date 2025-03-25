import { Outlet } from "react-router-dom";
import EventManageSidebar from "../components/sidebars/EventManageSidebar";
import AdminNavbar from "../components/navbar/ManagementNavbar";

const EventManageLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <EventManageSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="p-4 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EventManageLayout;

// import { Outlet } from "react-router-dom";
// import EventManageSidebar from "../components/sidebars/EventManageSidebar";
// import AdminNavbar from "../components/navbar/ManagementNavbar";
// import { useState, useEffect, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { toast } from "react-toastify";
// import { getAllEvents, getEventById } from "../services/api/EventApi"; // สมมติว่ามี API เหล่านี้
// import { useAuth } from "../context/AuthContext";

// const EventManageLayout = () => {
//   const navigate = useNavigate();
//   const { eventId } = useParams();
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [eventData, setEventData] = useState(null);
//   const [userEvents, setUserEvents] = useState([]);
//   const [error, setError] = useState(null);

//   const isAddEventPage = window.location.pathname === "/event/management/create";

//   // Fetch event data
//   const fetchEventData = useCallback(async () => {
//     if (!user || !user._id) {
//       setError("User session not found. Please login again.");
//       navigate("/login", { replace: true });
//       return;
//     }

//     setLoading(true);
//     try {
//       const eventsResponse = await getAllEvents();
//       const ownedEvents = eventsResponse.filter((event) => event.owner_id === user._id);
//       setUserEvents(ownedEvents);

//       if (ownedEvents.length === 0 && !isAddEventPage) {
//         navigate("/event/management/create", { replace: true });
//         return;
//       }

//       if (eventId) {
//         const userOwnsEvent = ownedEvents.some((event) => event._id === eventId);
//         if (!userOwnsEvent) {
//           setEventData(ownedEvents[0]);
//           navigate(`/event/management/${ownedEvents[0]._id}`, { replace: true });
//           toast.error("Access denied. Redirected to your default event.");
//           return;
//         }
//         const eventResponse = await getEventById(eventId);
//         setEventData(eventResponse);
//       } else if (!isAddEventPage && ownedEvents.length > 0) {
//         setEventData(ownedEvents[0]);
//         navigate(`/event/management/${ownedEvents[0]._id}`, { replace: true });
//       }
//     } catch (err) {
//       console.error("Error fetching event data:", err);
//       setError("Failed to load event data. Please try again.");
//       toast.error("Failed to load event data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user, isAddEventPage, navigate]);

//   // Initial fetch
//   useEffect(() => {
//     if (!eventData && !isAddEventPage) {
//       fetchEventData();
//     }
//   }, [fetchEventData, eventData, isAddEventPage]);

//   // Switch event
//   const handleSwitchEvent = useCallback(
//     async (newEventId) => {
//       if (newEventId === eventData?._id) return;

//       setLoading(true);
//       try {
//         const eventExists = userEvents.some((event) => event._id === newEventId);
//         if (!eventExists) {
//           throw new Error("Event not found or access denied.");
//         }
//         const eventDetails = await getEventById(newEventId);
//         setEventData(eventDetails);
//         navigate(`/event/management/${newEventId}`, { replace: true });
//       } catch (err) {
//         console.error("Error switching event:", err);
//         toast.error("Failed to switch event. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [eventData, userEvents, navigate]
//   );

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error && !isAddEventPage) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background text-text">
//         <div className="text-center p-8 max-w-md">
//           <div className="text-5xl text-primary mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-4">{error}</h2>
//           <button
//             onClick={() => navigate("/event")}
//             className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors mt-4"
//           >
//             Back to Events
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-background text-text">
//       {!isAddEventPage && (
//         <EventManageSidebar
//           eventData={eventData}
//           userEvents={userEvents}
//           onSwitchEvent={handleSwitchEvent}
//         />
//       )}
//       <div className={`flex-1 ${!isAddEventPage ? "ml-64" : ""}`}>
//         {!isAddEventPage && <AdminNavbar />}
//         <div className={`p-4 ${!isAddEventPage ? "mt-16" : ""}`}>
//           <Outlet context={{ eventData, userEvents, switchEvent: handleSwitchEvent }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventManageLayout;