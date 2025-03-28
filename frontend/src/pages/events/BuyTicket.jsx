import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getImage } from "../../services/api/ImageApi";

function BuyTicket() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(location.state?.event || null);
  const [selectedDate, setSelectedDate] = useState("");
  const [seatZoneUrl, setSeatZoneUrl] = useState(null);
  const [ticketCounts, setTicketCounts] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (!event) {
      const fetchEventById = async () => {
        try {
          const response = await fetch(`/api/events/${eventId}`);
          if (!response.ok) throw new Error("Failed to fetch event");
          let data = await response.json();
          setEvent(data);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEventById();
    }
  }, [eventId, event]);

  useEffect(() => {
    async function fetchImage() {
      if (event?.seatZone_url) {
        const seat_url = await getImage(event.seatZone_url);
        setSeatZoneUrl(seat_url);
      }
    }
    fetchImage();
  }, [event?.seatZone_url]);

  const handlePurchase = () => {
    // ตรวจสอบว่าเลือกวันที่และจำนวนบัตรแล้วหรือยัง
    if (!selectedDate || ticketCounts.length === 0) {
      alert("Please select a ticket count and a date first");
      return;
    }
    console.log(event);
    // สร้าง orderData
    const items = ticketCounts.map(ticket => {
      const zone = event.seat_zones.find(zone => zone._id === ticket.zone_id);
      const price_at_order = zone ? ticket.amount * zone.price : 0; // คำนวณราคาโดยการคูณจำนวนบัตรกับราคาโซน
      return {
        ref_id: eventId,
        refModel: "Event",
        seat_zone_id: ticket.zone_id, // ID ของโซนที่นั่ง
        quantity: ticket.amount, // จำนวนบัตรที่เลือก
        price_at_order: price_at_order, // ราคา ณ เวลาการสั่งซื้อ
        date: selectedDate, // วันที่เลือก
        zone_name: zone ? zone.zone_name : "" // ชื่อโซนที่นั่ง
      };
    });
    
    // คำนวณ total_price โดยการรวมราคาทั้งหมด
    const total_price = items.reduce((total, item) => total + item.price_at_order, 0);
  
    // สร้าง orderData
    const orderData = {
      order_type: "ticket", // ประเภทการสั่งซื้อ
      items: items,
      total_price: total_price, // ผลรวมราคาทั้งหมด
      status: "" // สถานะ (ยังไม่กำหนดค่า)
    };
  
    console.log(orderData);
    
    // นำข้อมูล orderData ไปส่งไปยังหน้าชำระเงิน
    navigate(`/payment/event/ticket`, { state: { orderData,event } });
  };

  const incrementCount = (zoneId) => {
    const zone = event.seat_zones.find(z => z._id === zoneId);
    if (!zone) return;

    setTicketCounts((prev) => {
      const existingIndex = prev.findIndex(item => item.zone_id === zoneId);
      const currentAmount = existingIndex !== -1 ? prev[existingIndex].amount : 0;
      
      // ตรวจสอบว่าไม่เกินจำนวนที่นั่ง
      if (currentAmount >= zone.number_of_seat) {
        alert(`Cannot select more than ${zone.number_of_seat} tickets for this zone`);
        return prev;
      }

      if (existingIndex !== -1) {
        return prev.map((item, index) => 
          index === existingIndex ? { ...item, amount: item.amount + 1 } : item
        );
      } else {
        return [...prev, { zone_id: zoneId, amount: 1 }];
      }
    });
  };

  const decrementCount = (zoneId) => {
    setTicketCounts((prev) => {
      return prev
        .map(item => item.zone_id === zoneId ? { ...item, amount: Math.max(item.amount - 1, 0) } : item)
        .filter(item => item.amount > 0);
    });
  };

  // คำนวณจำนวนที่นั่งคงเหลือสำหรับแต่ละโซน
  const getRemainingSeats = (zoneId) => {
    const zone = event.seat_zones.find(z => z._id === zoneId);
    if (!zone) return 0;
    
    const selectedCount = ticketCounts.find(item => item.zone_id === zoneId)?.amount || 0;
    return zone.number_of_seat - selectedCount;
  };

  if (!event) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{event.event_name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{event.start_date} - {event.end_date}</p>
            <img
              src={seatZoneUrl}
              alt="seat zone"
              className="rounded-lg w-full cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            />
          </div>

          <div className="md:w-1/2 space-y-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium">Select Date</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Choose a date</option>
              {event.weight_classes
                ?.filter(wc => wc.matches && wc.matches.length > 0)
                ?.flatMap(wc => wc.matches.map((match, index) => {
                  const date = new Date(match.match_date);
                  const formattedDate = date.toISOString().split('T')[0];
                  return <option key={index} value={formattedDate}>{formattedDate}</option>;
                }))}
            </select>

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Select Ticket Tier</h2>
            <div className="space-y-4">
              {event.seat_zones?.map((zone, index) => {
                const currentCount = ticketCounts.find(item => item.zone_id === zone._id)?.amount || 0;
                const remainingSeats = getRemainingSeats(zone._id);
                const isMaxReached = currentCount >= zone.number_of_seat;

                return (
                  <div
                    key={zone._id || `zone-${index}`}
                    className={`flex flex-col p-4 border-2 rounded-lg transition-all ${
                      ticketCounts.find(item => item.zone_id === zone._id) 
                        ? "border-rose-500 dark:text-white" 
                        : "border-gray-200 hover:border-rose-300 dark:border-gray-600 dark:hover:border-rose-500"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-lg font-medium text-gray-800 dark:text-white">
                          {zone.zone_name} - {formatNumber(zone.price)} THB
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Remaining: {remainingSeats}/{zone.number_of_seat} seats
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="relative flex items-center max-w-[8rem]">
                          <button
                            type="button"
                            onClick={() => decrementCount(zone._id)}
                            disabled={currentCount === 0}
                            className={`bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-s-lg p-3 h-11 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                              currentCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="bg-gray-50 border-x-0 border-gray-300 dark:bg-gray-800 dark:border-gray-600 h-11 text-center text-sm w-full"
                            value={currentCount}
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={() => incrementCount(zone._id)}
                            disabled={isMaxReached}
                            className={`bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-e-lg p-3 h-11 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                              isMaxReached ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {isMaxReached && (
                      <p className="text-sm text-rose-500 dark:text-rose-400">
                        Maximum tickets reached for this zone
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handlePurchase}
              disabled={ticketCounts.length === 0 || !selectedDate}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                ticketCounts.length > 0 && selectedDate 
                  ? "bg-rose-600 hover:bg-rose-700" 
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative rounded-lg p-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={seatZoneUrl}
              alt="seat zone"
              className="max-w-2xl max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyTicket;
