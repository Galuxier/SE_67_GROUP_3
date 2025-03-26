import PropTypes from "prop-types";
import { Plus, X, Users, Clock, Calendar, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getAlltrainer } from "../../services/api/GymApi";
import { useParams } from "react-router-dom";

export default function ActivityModal({
  isOpen,
  activities,
  setIsOpen,
  setActivities,
  currentDay,
  currentDate,
  newActivity,
  setNewActivity,
}) {
  const [isCoachSelectOpen, setIsCoachSelectOpen] = useState(false);
  const [existingActivities, setExistingActivities] = useState([]);
  const [busyTimeSlots, setBusyTimeSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [trainers, setTrainers] = useState([]); // State to hold the trainers
  const { gym_id } = useParams();

  // Load existing activities on component mount
  useEffect(() => {
    setExistingActivities(activities); // Use activities passed as props instead of localStorage
  }, [activities]); // Reload when activities change

  // Fetch trainers when the modal opens
  useEffect(() => {
    async function fetchTrainers() {
      const trainerData = await getAlltrainer();
      setTrainers(trainerData); // Set the trainers state
    }

    if (isOpen) {
      fetchTrainers(); // Fetch trainers only when modal is open
    }
  }, [isOpen]);

  // Calculate busy time slots when activities change
  useEffect(() => {
    if (existingActivities.length >= 0) {
      // Filter activities for the current date
      const sameDateActivities = existingActivities.filter(
        (activity) => activity.date === currentDate
      );

      // Create list of unavailable time slots
      const unavailableSlots = sameDateActivities.map((activity) => ({
        start: activity.startTime,
        end: activity.endTime,
        description: activity.description,
      }));

      setBusyTimeSlots(unavailableSlots);
    }
  }, [existingActivities, currentDate]);

  // Make sure newActivity has the current date
  useEffect(() => {
    if (newActivity?.date !== currentDate) {
      setNewActivity((prev) => ({ ...prev, date: currentDate }));
    }
  }, [currentDate, newActivity, setNewActivity]);

  if (!isOpen) return null; // Don't render if modal is closed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoach = (trainerItem) => {
    // Check if coach is already selected
    if (
      !newActivity.trainer ||
      !newActivity.trainer.some((coach) => coach.id === trainerItem.id)
    ) {
      const coachInfo = {
        id: trainerItem._id,
        name: trainerItem.Nickname,
        Nickname: trainerItem.Nickname,
        gym: trainerItem.gym,
      };

      setNewActivity((prev) => ({
        ...prev,
        trainer: [...(prev.trainer || []), coachInfo],
      }));
    }

    setIsCoachSelectOpen(false);
    setSearchQuery("");
  };

  const handleRemoveCoach = (coachId) => {
    setNewActivity((prev) => ({
      ...prev,
      trainer: prev.trainer.filter((coach) => coach.id !== coachId),
    }));
  };

  // Helper function to convert HH:MM to minutes for easier comparison
  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Check if time range overlaps with existing activities for the same day
  const isTimeOverlapping = (start, end) => {
    if (!start || !end) return false;

    const newStartTime = convertTimeToMinutes(start);
    const newEndTime = convertTimeToMinutes(end);

    return busyTimeSlots.some((slot) => {
      const existingStartTime = convertTimeToMinutes(slot.start);
      const existingEndTime = convertTimeToMinutes(slot.end);

      // Check for any overlap
      return (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      );
    });
  };

  // Check if time range is valid
  const isValidTimeRange = () => {
    if (!newActivity.startTime || !newActivity.endTime) return false;

    // Check if end time is after start time
    const startMinutes = convertTimeToMinutes(newActivity.startTime);
    const endMinutes = convertTimeToMinutes(newActivity.endTime);

    if (endMinutes <= startMinutes) return false;

    // Check if it doesn't overlap with other activities
    return !isTimeOverlapping(newActivity.startTime, newActivity.endTime);
  };

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newActivity.startTime ||
      !newActivity.endTime ||
      !newActivity.description
    ) {
      alert("Please fill in all required fields (time and description)");
      return;
    }

    // Validate that end time is after start time
    if (
      convertTimeToMinutes(newActivity.endTime) <=
      convertTimeToMinutes(newActivity.startTime)
    ) {
      alert("End time must be later than start time");
      return;
    }

    // Check time overlap
    if (isTimeOverlapping(newActivity.startTime, newActivity.endTime)) {
      alert("This time slot overlaps with an existing activity");
      return;
    }

    // Validate coach selection
    if (!newActivity.trainer || newActivity.trainer.length === 0) {
      alert("Please add at least one coach");
      return;
    }

    const newActivityData = {
      id: Date.now(),
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      description: newActivity.description,
      date: currentDate,
      // Use full objects to prevent data loss
      trainer: newActivity.trainer.map((coach) => ({
        ...coach,
        Nickname: coach.Nickname || coach.name, // Ensure Nickname exists
      })),
    };

    // Update activities state via setActivities
    setActivities((prevActivities) => {
      const updatedActivities = [...prevActivities, newActivityData];
      return updatedActivities; // Simply set activities to updated list
    });

    // Reset input values
    setNewActivity({
      startTime: "",
      endTime: "",
      description: "",
      trainer: [],
      date: currentDate,
    });
    setIsOpen(false);
  };

  const handleDeleteTimeSlot = (index) => {
    const slotToDelete = busyTimeSlots[index];

    // Filter out the activity from the activities list based on a unique identifier
    const updatedActivities = existingActivities.filter(
      (activity) =>
        activity.startTime !== slotToDelete.start ||
        activity.endTime !== slotToDelete.end // Add your condition to find the activity
    );

    // Update the activities state with the filtered list (removed the deleted activity)
    setActivities(updatedActivities);

    // Optionally, update the busy time slots if needed
    setBusyTimeSlots(
      updatedActivities.map((activity) => ({
        start: activity.startTime,
        end: activity.endTime,
        description: activity.description,
      }))
    );
  };

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter((t) => {
    const nickname = t.Nickname || ""; // Default to an empty string if undefined
    const firstName = t.firstName || ""; // Default to an empty string if undefined
    const lastName = t.lastName || ""; // Default to an empty string if undefined

    return (
      nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
      <div className="w-[650px] bg-white p-6 shadow-xl rounded-xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add Activity</h2>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <Calendar size={16} className="mr-1" />
            <span>
              Day {currentDay} •{" "}
              {new Date(currentDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Busy time slots indicator */}
        {busyTimeSlots.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-2 text-gray-700">
              <Info size={16} className="mr-2 text-amber-500" />
              <h3 className="font-medium">Busy Time Slots</h3>
            </div>
            <div className="space-y-2 max-h-28 overflow-y-auto pr-2">
              {busyTimeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-white rounded-md border border-gray-200 text-sm justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
                    <span className="font-medium text-gray-700">
                      {slot.start} - {slot.end}
                    </span>
                    <span className="ml-2 text-gray-500 truncate">
                      ({slot.description})
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTimeSlot(index)} // Calls delete function with index
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleAddActivitySubmit} className="space-y-5">
          {/* Time selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-500" />
                </div>
                <select
                  name="startTime"
                  value={newActivity.startTime || ""}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm appearance-none ${
                    newActivity.startTime &&
                    isTimeOverlapping(
                      newActivity.startTime,
                      newActivity.startTime + ":01"
                    )
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                >
                  <option value="">Select time</option>
                  {[...Array(24)].map((_, hour) =>
                    [0, 15, 30, 45].map((minute) => (
                      <option
                        key={`${hour}-${minute}`}
                        value={`${hour.toString().padStart(2, "0")}:${minute
                          .toString()
                          .padStart(2, "0")}`}
                      >
                        {hour.toString().padStart(2, "0")}:
                        {minute.toString().padStart(2, "0")}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {newActivity.startTime &&
                  isTimeOverlapping(
                    newActivity.startTime,
                    newActivity.startTime + ":01"
                  ) && (
                    <p className="mt-1 text-rose-500 text-xs">
                      Time conflicts with another activity
                    </p>
                  )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-500" />
                </div>
                <select
                  name="endTime"
                  value={newActivity.endTime || ""}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm appearance-none ${
                    newActivity.startTime &&
                    newActivity.endTime &&
                    !isValidTimeRange()
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                >
                  <option value="">Select time</option>
                  {[...Array(24)].map((_, hour) =>
                    [0, 15, 30, 45].map((minute) => (
                      <option
                        key={`${hour}-${minute}`}
                        value={`${hour.toString().padStart(2, "0")}:${minute
                          .toString()
                          .padStart(2, "0")}`}
                      >
                        {hour.toString().padStart(2, "0")}:
                        {minute.toString().padStart(2, "0")}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {newActivity.startTime &&
                  newActivity.endTime &&
                  !isValidTimeRange() && (
                    <p className="mt-1 text-rose-500 text-xs">
                      {convertTimeToMinutes(newActivity.endTime) <=
                      convertTimeToMinutes(newActivity.startTime)
                        ? "End time must be after start time"
                        : "Time conflicts with another activity"}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              placeholder="E.g., Basic techniques, Sparring session, etc."
              value={newActivity.description || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Coach selection */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Coaches <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCoachSelectOpen(true)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} className="mr-1" /> Add Coach
              </button>
            </div>

            {/* Display selected coaches */}
            {newActivity.trainer && newActivity.trainer.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {newActivity.trainer.map((coach) => (
                  <div
                    key={coach.id}
                    className="flex items-center bg-white rounded-full pl-2 pr-3 py-1 shadow-sm border border-gray-200"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs font-medium mr-1">
                      {coach.name.charAt(0)}
                    </span>
                    <span className="text-sm font-medium">{coach.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoach(coach.id)}
                      className="ml-2 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                <Users size={16} className="mr-2" />
                No coaches selected yet
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white rounded-lg text-sm font-medium ${
                newActivity.startTime &&
                newActivity.endTime &&
                isValidTimeRange() &&
                newActivity.description &&
                newActivity.trainer?.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={
                !newActivity.startTime ||
                !newActivity.endTime ||
                !isValidTimeRange() ||
                !newActivity.description ||
                !newActivity.trainer?.length
              }
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>

      {/* Coach Selection Modal */}
{isCoachSelectOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="w-[520px] bg-white p-6 shadow-xl rounded-xl relative max-h-[80vh] overflow-hidden flex flex-col">
      <button
        onClick={() => {
          setIsCoachSelectOpen(false);
          setSearchQuery("");
        }}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h3 className="text-lg font-bold mb-4 text-gray-800">Select Coach</h3>

      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Coaches with Gym Section */}
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 text-gray-800">Coaches with Gym</h4>
        <div className="flex overflow-x-auto pb-2 space-x-4">
          {filteredTrainers
            .filter((trainer) => trainer.gym) // Only trainers with gym
            .map((trainerItem) => (
              <button
                key={trainerItem._id}
                type="button"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleAddCoach(trainerItem)}
                disabled={newActivity.trainer?.some((t) => t.id === trainerItem._id)}
              >
                <img
                  src={trainerItem.image_url}
                  alt={trainerItem.Nickname}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{trainerItem.Nickname}</p>
                  {/* Optional: Display gym */}
                  <p className="text-xs text-gray-500">{trainerItem.gym}</p>
                </div>
                {newActivity.trainer?.some((t) => t.id === trainerItem._id) && (
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Coaches without Gym Section */}
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 text-gray-800">Coaches without Gym</h4>
        <div className="flex overflow-x-auto pb-2 space-x-4">
          {filteredTrainers
            .filter((trainer) => !trainer.gym) // Only trainers without gym
            .map((trainerItem) => (
              <button
                key={trainerItem._id}
                type="button"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleAddCoach(trainerItem)}
                disabled={newActivity.trainer?.some((t) => t.id === trainerItem._id)}
              >
                <img
                  src={trainerItem.image_url}
                  alt={trainerItem.Nickname}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{trainerItem.Nickname}</p>
                  <p className="text-xs text-gray-500">No Gym</p>
                </div>
                {newActivity.trainer?.some((t) => t.id === trainerItem._id) && (
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

ActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setActivities: PropTypes.func.isRequired,
  currentDay: PropTypes.number.isRequired,
  currentDate: PropTypes.string.isRequired,
  newActivity: PropTypes.object.isRequired,
  setNewActivity: PropTypes.func.isRequired,
};
