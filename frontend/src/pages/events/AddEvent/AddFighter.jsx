import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { createEvent } from "../../../services/api/EventApi";
import { boxers } from "./MockBoxer";
import EventStepIndicator from "./EventStepIndicator";

export default function FormAddFighter() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // รับค่าข้อมูลอีเวนต์จาก state หรือ localStorage
  const eventData = state?.formData || JSON.parse(sessionStorage.getItem("eventData"));
  const seatZoneImage = sessionStorage.getItem("seatZoneImage");
  const posterImage = sessionStorage.getItem("posterImage");

  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDates, setEventDates] = useState([]);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // ใช้ index เพื่อจัดการ Prev/Next
  const [updatedEventData, setEventData] = useState([]);

  // State สำหรับเก็บค่าจากฟอร์ม
  const [match_time, setTime] = useState("");
  const [weight, setWeight] = useState("");
  // const [boxer1_id, setBoxer1] = useState("");
  // const [boxer2_id, setBoxer2] = useState("");
  const [boxer1, setBoxer1] = useState(null);
  const [boxer2, setBoxer2] = useState(null);
  const [isBoxerSelectOpen, setIsBoxerSelectOpen] = useState(false);

  // State สำหรับเก็บข้อมูล fighter ที่กำลังแก้ไข
  const [editingFighter, setEditingFighter] = useState(null);

  // State สำหรับ Modal ยืนยันการลบ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);

  // State สำหรับแสดงข้อผิดพลาด
  const [errors, setErrors] = useState({});

  // โหลดข้อมูล fighters จาก localStorage
  useEffect(() => {
    const savedFighters = JSON.parse(localStorage.getItem("fighters")) || [];
    setMatches(savedFighters);
  }, []); // ใช้ Dependency Array ว่างเพื่อให้ทำงานเพียงครั้งเดียว

  useEffect(() => {
    if (eventData?.start_date && eventData?.end_date) {
      setEventDates(
        generateEventDates(eventData.start_date, eventData.end_date)
      );
    }
  }, []); // ✅ ให้ทำงานแค่ครั้งแรก

  const generateEventDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]); // แปลงเป็นรูปแบบ YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // เพิ่มวันทีละ 1
    }

    return dates;
  };

  const createFileFromBase64 = (base64String, fileName) => {
    try {
      if (!base64String.includes(",")) {
        throw new Error("Invalid Base64 format");
      }

      // แปลง Base64 เป็น Blob
      const byteCharacters = atob(base64String.split(",")[1]); // ตัด "data:image/png;base64," ออก
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // สร้าง File จาก Blob
      return new File([blob], fileName, { type: "image/png" });
    } catch (error) {
      console.error("Error converting Base64 to File:", error);
      return null;
    }
  };

  const handleDeleteFighter = () => {
    if (matchToDelete) {
      const updatedFighters = matches.filter(
        (match) => match.id !== matchToDelete.id
      );
      setMatches(updatedFighters);
      localStorage.setItem("fighters", JSON.stringify(updatedFighters));
      setIsDeleteModalOpen(false);
      setMatchToDelete(null);
    }
  };

  const handleSaveFighter = async () => {
    const eventDataToSend = {
      organizer_id: eventData.organizer_id,
      location_id: eventData.location_id,
      event_name: eventData.event_name,
      level: eventData.level.toLowerCase(),
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      description: eventData.description,
      poster_url: createFileFromBase64(posterImage, "poster_url.png"),
      seatZone_url: createFileFromBase64(seatZoneImage, "seatZone_url.png"),
      status: eventData.status || "preparing",
      seat_zones: eventData.seat_zones,
      weight_classes: eventData.weight_classes,
    };
  
    try {
      const res = await createEvent(eventDataToSend);
      console.log("Event created successfully:", res);
      
      // Clear all event data from sessionStorage after submission
      sessionStorage.removeItem("eventData");
      sessionStorage.removeItem("posterImage");
      sessionStorage.removeItem("seatZoneImage");
      sessionStorage.removeItem("weightClasses");
      sessionStorage.removeItem("fighters");
      
      navigate("/event/management/eventList");
    } catch (error) {
      console.error("Error creating event:", error);
      // Handle error
    }
  };

  const handleAddFighter = () => {
    const newErrors = {};
    if (!match_time) newErrors.time = "Please enter time.";
    if (!weight) newErrors.weight = "Please enter weight.";
    if (!boxer1) newErrors.boxer1 = "Please enter Boxer 1.";
    if (!boxer2) newErrors.boxer2 = "Please enter Boxer 2.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const newMatch = {
      match_id: Date.now(),
      match_time,
      weight,
      boxer1,
      boxer2,
      match_date: eventDates[selectedDateIndex],
      result: null,
    };
  
    const updatedFighters = editingFighter
      ? matches.map((match) => match.id === editingFighter.id ? newMatch : match)
      : [...matches, newMatch];
  
    setMatches(updatedFighters);
    sessionStorage.setItem("fighters", JSON.stringify(updatedFighters));
  
    // Update eventData with match data
    const updatedEventData = { ...eventData };
    const selectedWeightClass = updatedEventData.weight_classes.find(
      (wc) => wc.weigh_name === weight
    );
  
    if (selectedWeightClass) {
      selectedWeightClass.matches = selectedWeightClass.matches || [];
      
      const matchToPush = {
        match_time: new Date(`1970-01-01T${match_time}:00Z`),
        weight,
        boxer1_id: boxer1.id,
        boxer2_id: boxer2.id,
        match_date: eventDates[selectedDateIndex],
        result: null,
      };
      
      if (editingFighter) {
        const matchIndex = selectedWeightClass.matches.findIndex(m => m.id === editingFighter.id);
        if (matchIndex !== -1) {
          selectedWeightClass.matches[matchIndex] = matchToPush;
        }
      } else {
        selectedWeightClass.matches.push(matchToPush);
      }
  
      sessionStorage.setItem("eventData", JSON.stringify(updatedEventData));
      setEventData(updatedEventData);
    }
  
    setIsModalOpen(false);
    setEditingFighter(null);
    resetFormFields();
  };

  const handleEditFighter = (match) => {
    setEditingFighter(match);
    setTime(match.match_time);
    setWeight(match.weight);
    setBoxer1(match.boxer1);
    setBoxer2(match.boxer2);
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = (match) => {
    setMatchToDelete(match);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMatchToDelete(null);
  };

  const handlePrevDate = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const handleNextDate = () => {
    if (selectedDateIndex < eventDates.length - 1) {
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  const filterMatchesByDate = () => {
    return matches.filter((match) => match.match_date === eventDates[selectedDateIndex]);
  };
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");

  const filteredBoxers1 = boxers.filter(
    (boxer) =>
      boxer.first_name.toLowerCase().includes(searchTerm1.toLowerCase()) ||
      boxer.last_name.toLowerCase().includes(searchTerm1.toLowerCase())
  );

  const filteredBoxers2 = boxers.filter(
    (boxer) =>
      boxer.first_name.toLowerCase().includes(searchTerm2.toLowerCase()) ||
      boxer.last_name.toLowerCase().includes(searchTerm2.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-4/5 p-10 shadow-lg rounded-lg relative bg-white">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Event : {eventData?.event_name || "ไม่พบชื่ออีเวนต์"}
          </label>
          <label className="block text-sm text-gray-600">
            Date : {eventData?.start_date} - {eventData?.end_date}
          </label>
          <label className="block text-sm text-gray-600">
            Location : {eventData?.location_id}
          </label>
        </div>
        <EventStepIndicator currentStep={4} />
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-Bold">Match</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* เลือกวันที่ */}
        <div className="flex items-center justify-between my-5">
          <button
            onClick={handlePrevDate}
            disabled={selectedDateIndex === 0}
            className={`flex p-2 ${
              selectedDateIndex === 0 ? "text-gray-400" : "text-rose-500"
            } hover:text-rose-600`}
          >
            <GrLinkPrevious size={20} className="mr-2" />
            prev
          </button>
          <div className="mx-4 w-48">
            <label className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              min={eventData?.start_date}
              max={eventData?.end_date}
              value={eventDates[selectedDateIndex]}
              onChange={(e) => {
                const selectedIndex = eventDates.indexOf(e.target.value);
                setSelectedDateIndex(selectedIndex);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleNextDate}
            disabled={selectedDateIndex === eventDates.length - 1}
            className={`flex p-2 ${
              selectedDateIndex === eventDates.length - 1
                ? "text-gray-400"
                : "text-rose-500"
            } hover:text-rose-600`}
          >
            next
            <GrLinkNext size={20} className="ml-2" />
          </button>
        </div>

        <div className="space-y-4">
          {/* ตาราง */}
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Weight</th>
                <th className="p-2 border">Boxer 1</th>
                <th className="p-2 border">Boxer 2</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
            {filterMatchesByDate().length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-2 border text-center text-gray-500"
                  >
                    No matches found. Please add the match.
                  </td>
                </tr>
              ) : (
                filterMatchesByDate().map((match) => (
                  <tr key={match.match_id} className="text-center">
                    <td className="p-2 border">{match.match_time}</td>
                    <td className="p-2 border">{match.weight}</td>
                    <td className="p-2 border">
                      {match.boxer1.first_name} {match.boxer1.last_name}
                    </td>
                    <td className="p-2 border">
                      {match.boxer2.first_name} {match.boxer2.last_name}
                    </td>
                    <td className="p-2 border">
                      <button
                        className="text-blue-500 mr-2"
                        onClick={() => handleEditFighter(match)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteConfirmation(match)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate(-1)} variant="secondary">
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleSaveFighter}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มหรือแก้ไข fighter */}
      {isModalOpen && (
        <Modal
          title={editingFighter ? "Edit Fighter" : "Add Fighter"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingFighter(null);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                value={match_time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Weight</option>
                {eventData.weight_classes.map((wc) => (
                  <option key={wc.weigh_name} value={wc.weigh_name}>
                    {wc.weigh_name} ({wc.min_weight} kg - {wc.max_weight} kg)
                  </option>
                ))}
              </select>
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight}</p>
              )}
            </div>

            <div className="space-y-6">
              {/* Boxer 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Boxer 1</label>
                <input
                  type="text"
                  placeholder="ค้นหา Boxer..."
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchTerm1}
                  onChange={(e) => setSearchTerm1(e.target.value)}
                />

                {searchTerm1 && filteredBoxers1.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
                    {filteredBoxers1.map((boxer) => (
                      <div
                        key={boxer.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition duration-200"
                        onClick={() => {
                          setBoxer1(boxer);
                          setSearchTerm1(""); // รีเซ็ตค่า search
                        }}
                      >
                        <img
                          src={boxer.profile_picture_url}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                        <p className="text-gray-800 font-medium">{boxer.first_name} {boxer.last_name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {boxer1 && (
                  <div className="mt-2 flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-md">
                    <img
                      src={boxer1.profile_picture_url}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                    />
                    <p className="ml-3 text-lg font-semibold text-gray-800">
                      {boxer1.first_name} {boxer1.last_name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setBoxer1(null)}
                      className="ml-auto text-gray-500 hover:text-red-500 transition duration-200"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Boxer 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Boxer 2</label>
                <input
                  type="text"
                  placeholder="ค้นหา Boxer..."
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchTerm2}
                  onChange={(e) => setSearchTerm2(e.target.value)}
                />

                {searchTerm2 && filteredBoxers2.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
                    {filteredBoxers2.map((boxer) => (
                      <div
                        key={boxer.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition duration-200"
                        onClick={() => {
                          setBoxer2(boxer);
                          setSearchTerm2(""); // รีเซ็ตค่า search
                        }}
                      >
                        <img
                          src={boxer.profile_picture_url}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                        <p className="text-gray-800 font-medium">{boxer.first_name} {boxer.last_name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {boxer2 && (
                  <div className="mt-2 flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-md">
                    <img
                      src={boxer2.profile_picture_url}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                    />
                    <p className="ml-3 text-lg font-semibold text-gray-800">
                      {boxer2.first_name} {boxer2.last_name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setBoxer2(null)}
                      className="ml-auto text-gray-500 hover:text-red-500 transition duration-200"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleAddFighter}>
              {editingFighter ? "Update" : "Save"}
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal สำหรับเลือก Boxer */}
      {isBoxerSelectOpen && (
        <Modal title="Select Boxer" onClose={() => setIsBoxerSelectOpen(false)}>
          <div className="space-y-4">
            {boxers.map((boxer) => (
              <button
                key={boxer.id}
                className="flex items-center w-full p-2 hover:bg-gray-100"
                onClick={() => handleBoxerSelect(boxer)}
              >
                <img
                  src={boxer.profile_picture_url}
                  alt={boxer.first_name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                />
                <span className="ml-2">
                  {boxer.first_name} {boxer.last_name}
                </span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal สำหรับยืนยันการลบ */}
      {isDeleteModalOpen && (
        <Modal title="Confirm Delete" onClose={handleCancelDelete}>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this match?
            </p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCancelDelete} variant="secondary">
                Cancel
              </Button>
              <Button
                className="ml-2"
                onClick={handleDeleteFighter}
                variant="primary"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
