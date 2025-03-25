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
  const eventData = state?.formData || JSON.parse(sessionStorage.getItem("eventData"));
  const posterImage = sessionStorage.getItem("posterImage");
  const seatZoneImage = sessionStorage.getItem("seatZoneImage");

  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDates, setEventDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [match_time, setMatchTime] = useState("");
  const [weight, setWeight] = useState("");
  const [boxer1, setBoxer1] = useState(null);
  const [boxer2, setBoxer2] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");

  useEffect(() => {
    const savedMatches = JSON.parse(sessionStorage.getItem("matches")) || [];
    setMatches(savedMatches);
    if (eventData?.start_date && eventData?.end_date) {
      setEventDates(generateEventDates(eventData.start_date, eventData.end_date));
    }
  }, []);

  const generateEventDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const createFileFromBase64 = (base64String, fileName) => {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    return new File([blob], fileName, { type: "image/png" });
  };

  const validateMatch = () => {
    const newErrors = {};
    if (!match_time) newErrors.match_time = "Please enter match time.";
    if (!weight) newErrors.weight = "Please select a weight class.";
    if (!boxer1) newErrors.boxer1 = "Please select Boxer 1.";
    if (!boxer2) newErrors.boxer2 = "Please select Boxer 2.";
    if (boxer1 && boxer2 && boxer1.id === boxer2.id) newErrors.boxer2 = "Boxers must be different.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMatch = () => {
    if (!validateMatch()) return;

    const newMatch = {
      id: editingMatch ? editingMatch.id : Date.now(),
      match_time,
      weight,
      boxer1_id: boxer1.id,
      boxer2_id: boxer2.id,
      match_date: eventDates[selectedDateIndex],
      result: null,
    };

    const updatedMatches = editingMatch
      ? matches.map((m) => (m.id === editingMatch.id ? newMatch : m))
      : [...matches, newMatch];

    setMatches(updatedMatches);
    sessionStorage.setItem("matches", JSON.stringify(updatedMatches));

    const updatedEventData = {
      ...eventData,
      weight_classes: eventData.weight_classes.map((wc) =>
        wc.weigh_name === weight
          ? { ...wc, matches: editingMatch ? wc.matches.map((m) => (m.id === editingMatch.id ? newMatch : m)) : [...(wc.matches || []), newMatch] }
          : wc
      ),
    };
    sessionStorage.setItem("eventData", JSON.stringify(updatedEventData));

    setIsModalOpen(false);
    setEditingMatch(null);
    setMatchTime("");
    setWeight("");
    setBoxer1(null);
    setBoxer2(null);
    setSearchTerm1("");
    setSearchTerm2("");
    setErrors({});
  };

  const handleDeleteMatch = () => {
    const updatedMatches = matches.filter((m) => m.id !== matchToDelete.id);
    setMatches(updatedMatches);
    sessionStorage.setItem("matches", JSON.stringify(updatedMatches));
    setIsDeleteModalOpen(false);
    setMatchToDelete(null);
  };

  const handleSubmit = async () => {
    if (matches.length === 0) {
      setErrors({ general: "Please add at least one match." });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("organizer_id", eventData.organizer_id);
    formDataToSend.append("location_id", eventData.location_id);
    formDataToSend.append("event_name", eventData.event_name);
    formDataToSend.append("level", eventData.level.toLowerCase());
    formDataToSend.append("start_date", eventData.start_date);
    formDataToSend.append("end_date", eventData.end_date);
    formDataToSend.append("description", eventData.description);
    formDataToSend.append("poster_url", createFileFromBase64(posterImage, "poster.png"));
    formDataToSend.append("seatZone_url", createFileFromBase64(seatZoneImage, "seatZone.png"));
    formDataToSend.append("weight_classes", JSON.stringify(eventData.weight_classes));
    formDataToSend.append("seat_zones", JSON.stringify(eventData.seat_zones));

    try {
      await createEvent(formDataToSend);
      sessionStorage.clear();
      navigate("/event/management/eventList");
    } catch (error) {
      setErrors({ general: "Failed to create event. Please try again." });
    }
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setMatchTime(match.match_time);
    setWeight(match.weight);
    setBoxer1(boxers.find((b) => b.id === match.boxer1_id));
    setBoxer2(boxers.find((b) => b.id === match.boxer2_id));
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
    if (selectedDateIndex > 0) setSelectedDateIndex(selectedDateIndex - 1);
  };

  const handleNextDate = () => {
    if (selectedDateIndex < eventDates.length - 1) setSelectedDateIndex(selectedDateIndex + 1);
  };

  const filteredMatches = matches.filter((m) => m.match_date === eventDates[selectedDateIndex]);
  const filteredBoxers1 = boxers.filter((b) =>
    `${b.first_name} ${b.last_name}`.toLowerCase().includes(searchTerm1.toLowerCase())
  );
  const filteredBoxers2 = boxers.filter((b) =>
    `${b.first_name} ${b.last_name}`.toLowerCase().includes(searchTerm2.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-4/5 p-10 shadow-lg rounded-lg bg-white">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">{eventData?.event_name}</label>
          <label className="block text-sm text-gray-600">
            {eventData?.start_date} - {eventData?.end_date}
          </label>
          <label className="block text-sm text-gray-600">{eventData?.location_id}</label>
        </div>
        <EventStepIndicator currentStep={4} />
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-2xl font-bold">Matches</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Plus size={20} />
          </button>
        </div>
        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
        <div className="flex items-center justify-between my-5">
          <button
            onClick={handlePrevDate}
            disabled={selectedDateIndex === 0}
            className={`flex p-2 ${selectedDateIndex === 0 ? "text-gray-400" : "text-rose-500"}`}
          >
            <GrLinkPrevious size={20} className="mr-2" /> Prev
          </button>
          <div className="mx-4 w-48">
            <label className="block text-sm font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              min={eventData?.start_date}
              max={eventData?.end_date}
              value={eventDates[selectedDateIndex]}
              onChange={(e) => setSelectedDateIndex(eventDates.indexOf(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleNextDate}
            disabled={selectedDateIndex === eventDates.length - 1}
            className={`flex p-2 ${selectedDateIndex === eventDates.length - 1 ? "text-gray-400" : "text-rose-500"}`}
          >
            Next <GrLinkNext size={20} className="ml-2" />
          </button>
        </div>
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
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-2 border text-center text-gray-500">
                  No matches found. Please add a match.
                </td>
              </tr>
            ) : (
              filteredMatches.map((match) => (
                <tr key={match.id} className="text-center">
                  <td className="p-2 border">{match.match_time}</td>
                  <td className="p-2 border">{match.weight}</td>
                  <td className="p-2 border">
                    {boxers.find((b) => b.id === match.boxer1_id)?.first_name}{" "}
                    {boxers.find((b) => b.id === match.boxer1_id)?.last_name}
                  </td>
                  <td className="p-2 border">
                    {boxers.find((b) => b.id === match.boxer2_id)?.first_name}{" "}
                    {boxers.find((b) => b.id === match.boxer2_id)?.last_name}
                  </td>
                  <td className="p-2 border">
                    <button className="text-blue-500 mr-2" onClick={() => handleEditMatch(match)}>
                      <Pencil size={16} />
                    </button>
                    <button className="text-red-500" onClick={() => handleDeleteConfirmation(match)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-6">
          <Button onClick={() => navigate(-1)} variant="secondary">Previous</Button>
          <Button onClick={handleSubmit} className="ml-2">Submit</Button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title={editingMatch ? "Edit Match" : "Add Match"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMatch(null);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={match_time}
                onChange={(e) => setMatchTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.match_time && <p className="text-red-500 text-sm">{errors.match_time}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight Class</label>
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
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Boxer 1</label>
              <input
                type="text"
                placeholder="Search Boxer..."
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm1 && filteredBoxers1.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                  {filteredBoxers1.map((boxer) => (
                    <div
                      key={boxer.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setBoxer1(boxer);
                        setSearchTerm1("");
                      }}
                    >
                      {boxer.first_name} {boxer.last_name}
                    </div>
                  ))}
                </div>
              )}
              {boxer1 && (
                <div className="mt-2 flex items-center">
                  <span>{boxer1.first_name} {boxer1.last_name}</span>
                  <button onClick={() => setBoxer1(null)} className="ml-2 text-red-500">✕</button>
                </div>
              )}
              {errors.boxer1 && <p className="text-red-500 text-sm">{errors.boxer1}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Boxer 2</label>
              <input
                type="text"
                placeholder="Search Boxer..."
                value={searchTerm2}
                onChange={(e) => setSearchTerm2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm2 && filteredBoxers2.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                  {filteredBoxers2.map((boxer) => (
                    <div
                      key={boxer.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setBoxer2(boxer);
                        setSearchTerm2("");
                      }}
                    >
                      {boxer.first_name} {boxer.last_name}
                    </div>
                  ))}
                </div>
              )}
              {boxer2 && (
                <div className="mt-2 flex items-center">
                  <span>{boxer2.first_name} {boxer2.last_name}</span>
                  <button onClick={() => setBoxer2(null)} className="ml-2 text-red-500">✕</button>
                </div>
              )}
              {errors.boxer2 && <p className="text-red-500 text-sm">{errors.boxer2}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleAddMatch}>
              {editingMatch ? "Update" : "Save"}
            </Button>
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal title="Confirm Delete" onClose={handleCancelDelete}>
          <p className="text-gray-700">Are you sure you want to delete this match?</p>
          <div className="flex justify-end mt-4">
            <Button onClick={handleCancelDelete} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleDeleteMatch} variant="primary">Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}