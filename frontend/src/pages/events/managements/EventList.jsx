import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { PlusIcon, PencilSquareIcon, TrashIcon,EyeIcon  } from "@heroicons/react/24/outline";
import { getEventsByOrganizerId } from "../../../services/api/EventApi"; // แก้ชื่อฟังก์ชันให้ถูกต้อง
import { useAuth } from "../../../context/AuthContext";

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [filterType, setFilterType] = useState(""); // สถานะการกรองตามประเภท
  const [filterStatus, setFilterStatus] = useState(""); // สถานะการกรองตามสถานะ

  const organizer = useAuth();
  const organizer_id = organizer?.user?._id;

  useEffect(() => {
    if (!organizer_id) return;

    const fetchData = async () => {
      try {
        const myEvent = await getEventsByOrganizerId(organizer_id);
        setEvents(myEvent.data);
        setFilteredEvents(myEvent.data); // เริ่มต้นให้แสดงทุกเหตุการณ์
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizer_id]);

  // ฟังก์ชันกรองเหตุการณ์ตามประเภทและสถานะ
  useEffect(() => {
    let filtered = events;

    if (filterType) {
      filtered = filtered.filter((event) => event.event_type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((event) => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [filterType, filterStatus, events]); // ทำงานเมื่อ `filterType`, `filterStatus` หรือ `events` เปลี่ยน

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setEvents((prevEvents) => prevEvents.filter((e) => e._id !== eventToDelete._id));
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    }).format(new Date(date));
  };

  const handleEventClick = (event) => {
    console.log("navigate to:", `/event/${event._id}`);
    const eventData = {
      ...event,
      start_date: new Date(event.start_date).toISOString().split("T")[0],
      end_date: new Date(event.end_date).toISOString().split("T")[0],
    };

    navigate(`/event/${event._id}`, { state: { event: eventData } });
  };

  return (
    <div className="w-4/5 mx-auto flex flex-col justify-center">
  <div className="mb-6 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-text">My Events</h1>

    {/* Filter Options */}
    <div className="flex items-center space-x-4">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-3 py-2 rounded-md border dark:bg-gray-800"
      >
        <option value="">Filter by Type</option>
        <option value="registration">Registration</option>
        <option value="ticket_sales">Ticket Sales</option>
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-3 py-2 rounded-md border dark:bg-gray-800"
      >
        <option value="">Filter by Status</option>
        <option value="preparing">Preparing</option>
        <option value="ongoing">On Going</option>
        <option value="finished">Finished</option>
        <option value="cancel">Cancel</option>
      </select>
    </div>
  </div>

  {/* Event List */}
  {!loading && (
    <div className="bg-card rounded-lg shadow-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-auto divide-y divide-border">
          <thead className="bg-bar">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event._id} className="hover:bg-bar/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{event.event_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{formatDate(event.start_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{formatDate(event.end_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex justify-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap justify-center">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-green-800">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEventClick(event)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-2 rounded-full transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/event/management/${event._id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 p-2 rounded-full transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-text">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>

  );
};

export default EventList;
