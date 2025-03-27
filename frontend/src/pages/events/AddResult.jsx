import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react"; // Importing checkmark icon
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { getUser } from "../../services/api/UserApi";

export default function FormAddResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(location.state?.event || null);
  const [matches, setMatches] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredMatches, setFilteredMatches] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchToSave, setMatchToSave] = useState(null);

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
    if (event) {
      // ดึงวันที่ทั้งหมดจากการแข่งขันทุก weight class
      const allDates = event.weight_classes?.flatMap(wc => 
        wc.matches?.map(match => match.match_date)
      ) || [];
      
      // กรองวันที่ที่ไม่ซ้ำกัน
      const uniqueDates = [...new Set(allDates)];
      setEventDates(uniqueDates);
      
      // ตั้งค่าเริ่มต้นเป็นวันที่แรกถ้ามี
      if (uniqueDates.length > 0 && !selectedDate) {
        setSelectedDate(uniqueDates[0]);
      }
    }
  }, [event]);

  useEffect(() => {
    // เมื่อ event หรือ selectedDate เปลี่ยน ให้กรองการแข่งขันตามวันที่
    if (event && selectedDate) {
      const filtered = event.weight_classes?.flatMap(wc => 
        wc.matches?.filter(match => match.match_date === selectedDate)
          .map(match => ({
            ...match,
            weight: wc.weigh_name // เพิ่ม weight class เข้าไปในข้อมูลการแข่งขัน
          }))
      ) || [];
      console.log(filtered);
      
      setFilteredMatches(filtered);
    }
  }, [event, selectedDate]);

  const getBoxer = async (id) => {
    try {
      const response = await getUser(id);
      console.log(response);
      return response; // แสดงชื่อของ boxer
    } catch (error) {
      console.error(error);
      return "Unknown";
    }
  };
  
  const [boxer1Name, setBoxer1Name] = useState("");
  const [boxer2Name, setBoxer2Name] = useState("");
  const [boxer1, setBoxer1] = useState([]);
  const [boxer2, setBoxer2] = useState([]);
  
  // ใช้ useEffect เพื่อดึงข้อมูล boxer 1 และ boxer 2
  useEffect(() => {
    const fetchBoxerNames = async () => {
      console.log("filter",filteredMatches);
      
      if (filteredMatches.length > 0) {
        const boxer1 = await getBoxer(filteredMatches[0].boxer1_id);
        const boxer2 = await getBoxer(filteredMatches[0].boxer2_id);
        console.log("boxer",boxer1);
        
        // setBoxer1Name(boxer1);
        // setBoxer2Name(boxer2);
        setBoxer1(boxer1);
        setBoxer2(boxer2);
      }
    };
    fetchBoxerNames();
  }, [filteredMatches]); // เมื่อ filteredMatches เปลี่ยนแปลง

  const handleSaveFighter = () => {
    localStorage.setItem("matches", JSON.stringify({ matches }));
    navigate("/event/management/onGoing");
  };

  const handleSaveConfirmation = (match) => {
    setMatchToSave(match);
    setIsModalOpen(true);
  };
  
  const handleConfirmSave = () => {
    if (matchToSave) {
      console.log("Confirmed save:", matchToSave);
      setIsModalOpen(false);
      setMatchToSave(null);
    }
  };
  

  const handleUpdateResult = (matchId, result) => {

    const updatedMatches = filteredMatches.map((match) =>
      match._id === matchId ? { ...match, result } : match
    );
    setMatches(updatedMatches);
  };
  
  const handleCancelSave = () => {
    setIsModalOpen(false);
    setMatchToSave(null);
  };

  return (
    <div className="flex justify-center items-centeพ">
      <div className="w-4/5 p-10 shadow-lg bg-white dark:bg-gray-800 border border-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700 dark:text-white">
            Event : {event?.event_name || "ไม่พบชื่ออีเวนต์"}
          </label>
          <label className="block text-sm text-gray-600 dark:text-gray-300">
            Date : {event?.start_date} - {event?.end_date}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Match Result</h3>
        </div>

        <div className="flex items-center justify-between my-5">
          <div className="mx-4 w-48">
            <label className="block text-gray-700 dark:text-gray-300 font-medium">Select Date</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Choose a date</option>
              {eventDates.map((date, index) => {
                const formattedDate = new Date(date).toISOString().split('T')[0];
                return (
                  <option key={index} value={date}>
                    {formattedDate}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <table className="w-full border-collapse border rounded-lg text-sm dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border dark:border-gray-600">Weight</th>
                <th className="p-2 border dark:border-gray-600">Boxer 1</th>
                <th className="p-2 border dark:border-gray-600">Boxer 2</th>
                <th className="p-2 border dark:border-gray-600">Winner</th>
                <th className="p-2 border dark:border-gray-600">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-2 border text-center text-gray-500 dark:text-gray-400">
                    {selectedDate ? "No matches found for selected date" : "Please select a date"}
                  </td>
                </tr>
              ) : (
                filteredMatches.map((match) => (
                  <tr key={match._id} className="text-center">
                    <td className="p-2 border dark:border-gray-600">{match.weight}</td>
                    <td className="p-2 border dark:border-gray-600">{boxer1.first_name} {boxer1.last_name} ({boxer1.nickname})</td> 
                    <td className="p-2 border dark:border-gray-600">{boxer2.first_name} {boxer2.last_name} ({boxer2.nickname})</td> 
                    <td className="p-2 border dark:border-gray-600">
                      <select
                        value={match.result}
                        onChange={(e) => handleUpdateResult(match._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="">Select Winner</option>
                        <option value="boxer1_win">{boxer1.first_name} {boxer1.last_name} ({boxer1.nickname})</option>
                        <option value="boxer2_win">{boxer2.first_name} {boxer2.last_name} ({boxer2.nickname})</option>
                        <option value="draw">Draw</option>
                      </select>
                    </td>
                    <td className="p-2 border dark:border-gray-600">
                      <button
                        className="text-green-500 dark:text-green-400"
                        onClick={() => handleSaveConfirmation(match)}
                      >
                        <CheckCircle size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 mr-2 border border-gray-600 rounded-lg text-gray-300"
            >
              Back
            </button>
            <button 
              onClick={handleSaveFighter} 
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal title="Confirm Result" onClose={handleCancelSave}>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-white">Are you sure you want to select this result?</p>
          <div className="flex justify-end mt-4">
            <button onClick={handleCancelSave} className="px-4 py-2 mr-2 border border-gray-600 rounded-lg text-gray-300">
              Cancel
            </button>
            <button  className="px-4 py-2 bg-primary text-white rounded-lg" onClick={handleConfirmSave}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
      )}
    </div>
  );
}
