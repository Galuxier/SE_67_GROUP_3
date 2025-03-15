import { useNavigate } from "react-router-dom";

function EventCard() {
  const navigate = useNavigate();

  const handleEventClick = (event) => {
    console.log("navigate to:", `/event/detail/${event._id}`);

    // ✅ แปลง `Date` object เป็น `string` "YYYY-MM-DD" ก่อนส่งไปยัง `EventDetail`
    const eventData = {
      ...event,
      start_date: event.start_date.toISOString().split("T")[0], // 🔥 "YYYY-MM-DD"
      end_date: event.end_date.toISOString().split("T")[0], // 🔥 "YYYY-MM-DD"
    };

    navigate(`/event/detail/${event._id}`, { state: { event: eventData } });
  };

  const events = [
    {
      _id: "1",
      image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url)
        .href,
      event_name: "Muaythai",
      level: "Rookie",
      start_date: new Date("2024-02-27"), // ใช้ Date object
      end_date: new Date("2024-03-07"),
      event_type: "TicketSale", // ใช้ event_type ตาม Model
      status: "preparing",
      seat_zones: [
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da01",
          zone_name: "VIP",
          price: 5000,
          number_of_seat: 50,
          seats: [],
        },
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da02",
          zone_name: "Standard",
          price: 1000,
          number_of_seat: 200,
          seats: [],
        },
      ],
      weight_classes: [], // ไม่ต้องใส่ถ้าเป็น TicketSale
    },
    {
      _id: "2",
      image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url)
        .href,
      event_name: "Muaythai",
      level: "Fighter",
      start_date: new Date("2024-02-27"),
      end_date: new Date("2024-03-07"),
      event_type: "Registration",
      status: "preparing",
      seat_zones: [], // ไม่ต้องมีที่นั่งถ้าเป็น Registration
      weight_classes: [
        {
          type: "lightweight",
          weigh_name: "Lightweight",
          min_weight: 50,
          max_weight: 60,
          max_enrollment: 16, // เพิ่มตาม Model
          matches: [],
          applicants: [],
          qualifiers: [],
        },
        {
          type: "middleweight",
          weigh_name: "Middleweight",
          min_weight: 61,
          max_weight: 70,
          max_enrollment: 16,
          matches: [],
          applicants: [],
          qualifiers: [],
        },
      ],
    },
    {
      _id: "3",
      image_url: new URL("../assets/images/muaythai-003.png", import.meta.url)
        .href,
      event_name: "Muaythai",
      level: "Rookie",
      start_date: new Date("2024-02-27"),
      end_date: new Date("2024-03-07"),
      event_type: "Registration",
      status: "preparing",
      seat_zones: [],
      weight_classes: [
        {
          type: "middleweight",
          weigh_name: "Middleweight",
          min_weight: 61,
          max_weight: 70,
          max_enrollment: 16,
          matches: [],
          applicants: [],
          qualifiers: [],
        },
        {
          type: "heavyweight",
          weigh_name: "Heavyweight",
          min_weight: 71,
          max_weight: 80,
          max_enrollment: 16,
          matches: [],
          applicants: [],
          qualifiers: [],
        },
      ],
    },
    {
      _id: "4",
      image_url: new URL("../assets/images/muaythai-003.png", import.meta.url)
        .href,
      event_name: "Muaythai",
      level: "Fighter",
      start_date: new Date("2024-02-27"),
      end_date: new Date("2024-03-07"),
      event_type: "TicketSale",
      status: "preparing",
      seat_zones: [
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da03",
          zone_name: "VIP",
          price: 5000,
          number_of_seat: 50,
          seats: [],
        },
        {
          seat_zone_id: "660b3f5f1b2c001c8e4da04",
          zone_name: "Standard",
          price: 1000,
          number_of_seat: 200,
          seats: [],
        },
      ],
      weight_classes: [],
    },
  ];
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <button
          key={event._id}
          className="max-w-xs rounded overflow-hidden shadow-lg bg-white dark:bg-gray-600 text-left cursor-pointer transition transform hover:scale-105"
          onClick={() => handleEventClick(event)}
        >
          <img
            className="w-full aspect-[4/3] object-cover"
            src={event.image_url}
            alt={event.event_name}
          />
          <div className="px-6 py-4">
            <div className="font-semibold text-xl mb-2">{event.event_name}</div>
            <div className={`font-normal ${getLevelColor(event.level)}`}>
              {event.level}
            </div>
            <div className="flex items-center font-base text-lg mb-2">
              <span className="mr-2">{formatDate(event.start_date)}</span>
              <span className="mr-2">-</span>
              <span className="mr-2">{formatDate(event.end_date)}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default EventCard;
