import { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";

export default function FormAddResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // รับค่าข้อมูลอีเวนต์จาก state หรือ localStorage
  const eventData = state?.formData || JSON.parse(localStorage.getItem("eventData"));

  const [matches, setMatches] = useState([]);
  const [eventDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // ใช้ index เพื่อจัดการ Prev/Next

  // State สำหรับ Modal ยืนยันการลบ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);

  // โหลดข้อมูล fighters จาก localStorage
  useEffect(() => {
    const savedFighters = JSON.parse(localStorage.getItem("fighters")) || [];
    setMatches(savedFighters);
  }, []);

  const handleDeleteFighter = () => {
    if (matchToDelete) {
      const updatedFighters = matches.filter((match) => match.id !== matchToDelete.id);
      setMatches(updatedFighters);
      localStorage.setItem("fighters", JSON.stringify(updatedFighters));
      setIsDeleteModalOpen(false);
      setMatchToDelete(null);
    }
  };

  const handleSaveFighter = () => {
    const matchesData = {
      ...eventData,
      matches: matches,
    };
    localStorage.setItem("matches", JSON.stringify(matchesData));
    navigate("/event");
  };

  const handleUpdateResult = (matchId, result) => {
    const updatedMatches = matches.map((match) =>
      match.id === matchId ? { ...match, result } : match
    );
    setMatches(updatedMatches);
    localStorage.setItem("fighters", JSON.stringify(updatedMatches));
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

  const filteredFighters = matches.filter((match) => match.date === eventDates[selectedDateIndex]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[1000px] p-10 shadow-lg bg-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Event : {eventData?.eventName || "ไม่พบชื่ออีเวนต์"}
          </label>
          <label className="block text-sm text-gray-600">
            Date : {eventData?.startDate} - {eventData?.endDate}
          </label>
          <label className="block text-sm text-gray-600">
            Location : {eventData?.location}
          </label>
        </div>
        <br></br>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-Bold">Match Result</h3>
        </div>

        {/* เลือกวันที่ */}
        <div className="flex items-center justify-between my-5">
          <button
            onClick={handlePrevDate}
            disabled={selectedDateIndex === 0}
            className={`flex p-2 ${selectedDateIndex === 0 ? "text-gray-400" : "text-rose-500"} hover:text-rose-600`}
          >
            <GrLinkPrevious size={20} className="mr-2" />prev
          </button>
          <div className="mx-4 w-48">
            <label className="block text-sm font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              min={eventData?.startDate}
              max={eventData?.endDate}
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
            className={`flex p-2 ${selectedDateIndex === eventDates.length - 1 ? "text-gray-400" : "text-rose-500"} hover:text-rose-600`}
          >
            next<GrLinkNext size={20} className="ml-2" />
          </button>
        </div>

        <div className="space-y-4">
          {/* ตาราง */}
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Weight</th>
                <th className="p-2 border">Boxer 1</th>
                <th className="p-2 border">Boxer 2</th>
                <th className="p-2 border">Winner</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredFighters.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-2 border text-center text-gray-500">
                    No matches found. Please add the match.
                  </td>
                </tr>
              ) : (
                filteredFighters.map((match) => (
                  <tr key={match.id} className="text-center">
                    <td className="p-2 border">{match.weight}</td>
                    <td className="p-2 border">{match.boxer1}</td>
                    <td className="p-2 border">{match.boxer2}</td>
                    <td className="p-2 border">
                      <select
                        value={match.result || ""}
                        onChange={(e) => handleUpdateResult(match.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Winner</option>
                        <option value={match.boxer1}>{match.boxer1}</option>
                        <option value={match.boxer2}>{match.boxer2}</option>
                      </select>
                    </td>
                    <td className="p-2 border">
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

      {/* Modal สำหรับยืนยันการลบ */}
      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          onClose={handleCancelDelete}
        >
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete this match?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCancelDelete} variant="secondary">Cancel</Button>
              <Button className="ml-2" onClick={handleDeleteFighter} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}