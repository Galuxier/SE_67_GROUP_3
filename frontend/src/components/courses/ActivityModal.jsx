import PropTypes from "prop-types";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { trainer } from "../Trainer"; // Import the trainer data from TrainerList

export default function ActivityModal({ 
  isOpen, 
  setIsOpen, 
  setActivities, 
  currentDay,
  currentDate,
  newActivity,
  setNewActivity 
}) {
  const [isCoachSelectOpen, setIsCoachSelectOpen] = useState(false);
  const [existingActivities, setExistingActivities] = useState([]);
  const [busyTimeSlots, setBusyTimeSlots] = useState([]);
  
  // Load existing activities on component mount
  useEffect(() => {
    // Load existing activities from localStorage
    const savedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setExistingActivities(savedActivities);
  }, [isOpen]); // Reload when modal opens

  // Calculate busy time slots when activities change
  useEffect(() => {
    if (existingActivities.length >= 0) {
      // Filter activities for the current date
      const sameDateActivities = existingActivities.filter(
        activity => activity.date === currentDate
      );
      
      // Create list of unavailable time slots
      const unavailableSlots = sameDateActivities.map(activity => ({
        start: activity.startTime,
        end: activity.endTime,
        description: activity.description
      }));
      
      setBusyTimeSlots(unavailableSlots);
    }
  }, [existingActivities, currentDate]);

  // Make sure newActivity has the current date
  useEffect(() => {
    if (newActivity?.date !== currentDate) {
      setNewActivity(prev => ({ ...prev, date: currentDate }));
    }
  }, [currentDate, newActivity, setNewActivity]);

  if (!isOpen) return null; // Don't render if modal is closed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddCoach = (trainerItem) => {
    // Check if coach is already selected
    if (!newActivity.trainer || !newActivity.trainer.some(coach => coach.id === trainerItem.id)) {
      const coachInfo = {
        id: trainerItem.id,
        name: trainerItem.Nickname,
        Nickname: trainerItem.Nickname, // Add this line to keep the Nickname property
        gym: trainerItem.gym
      };
      
      setNewActivity(prev => ({
        ...prev,
        trainer: [...(prev.trainer || []), coachInfo]
      }));
    }
    
    setIsCoachSelectOpen(false);
  };
  
  const handleRemoveCoach = (coachId) => {
    setNewActivity(prev => ({
      ...prev,
      trainer: prev.trainer.filter(coach => coach.id !== coachId)
    }));
  };

  // Helper function to convert HH:MM to minutes for easier comparison
  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Check if time range overlaps with existing activities for the same day
  const isTimeOverlapping = (start, end) => {
    if (!start || !end) return false;
    
    const newStartTime = convertTimeToMinutes(start);
    const newEndTime = convertTimeToMinutes(end);
    
    return busyTimeSlots.some(slot => {
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

    // // Validate required fields
    // if (!newActivity.startTime || !newActivity.endTime || !newActivity.description) {
    //   alert("กรุณากรอกข้อมูลเวลาและรายละเอียดให้ครบ");
    //   return;
    // }
    
    // // Validate that end time is after start time
    // if (convertTimeToMinutes(newActivity.endTime) <= convertTimeToMinutes(newActivity.startTime)) {
    //   alert("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น");
    //   return;
    // }
    
    // // Check time overlap
    // if (isTimeOverlapping(newActivity.startTime, newActivity.endTime)) {
    //   alert("เวลานี้ซ้ำซ้อนกับกิจกรรมที่มีอยู่แล้ว กรุณาเลือกเวลาอื่น");
    //   return;
    // }
    
    // // Validate coach selection
    // if (!newActivity.trainer || newActivity.trainer.length === 0) {
    //   alert("กรุณาเพิ่มโค้ชอย่างน้อย 1 คน");
    //   return;
    // }

    const newActivityData = {
      id: Date.now(),
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      description: newActivity.description,
      date: currentDate,
      // Use full objects to prevent data loss
      trainer: newActivity.trainer.map(coach => ({
        ...coach,
        Nickname: coach.Nickname || coach.name // Ensure Nickname exists
      }))
    };

    setActivities((prevActivities) => {
      const updatedActivities = [...prevActivities, newActivityData];
      localStorage.setItem("activities", JSON.stringify(updatedActivities));
      return updatedActivities;
    });

    // Reset input values
    setNewActivity({ 
      startTime: "", 
      endTime: "", 
      description: "", 
      trainer: [],
      date: currentDate 
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="w-[700px] p-10 shadow-lg bg-white rounded-lg relative">
        <h3 className="text-base font-medium mb-3">เพิ่มกิจกรรม - วันที่ {currentDay}</h3>
        
        {/* Show busy time slots */}
        {busyTimeSlots.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">ช่วงเวลาที่ไม่ว่าง:</h4>
            <div className="grid grid-cols-1 gap-1">
              {busyTimeSlots.map((slot, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 p-2 rounded text-sm flex items-center"
                >
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span className="font-medium text-gray-500">{slot.start} - {slot.end}</span>
                  <span className="ml-2 text-gray-500">({slot.description})</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleAddActivitySubmit} className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-700">เวลาเริ่มต้น</label>
              <input
                type="time"
                name="startTime"
                value={newActivity.startTime || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg text-sm ${
                  newActivity.startTime && isTimeOverlapping(newActivity.startTime, newActivity.startTime+':01') 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-blue-300 bg-blue-50'
                }`}
                required
              />
              {newActivity.startTime && isTimeOverlapping(newActivity.startTime, newActivity.startTime+':01') && (
                <p className="text-red-500 text-xs mt-1">เวลานี้ซ้ำซ้อนกับกิจกรรมอื่น</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-700">เวลาสิ้นสุด</label>
              <input
                type="time"
                name="endTime"
                value={newActivity.endTime || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg text-sm ${
                  newActivity.startTime && newActivity.endTime && !isValidTimeRange()
                    ? 'border-red-500 bg-red-50' 
                    : 'border-blue-300 bg-blue-50'
                }`}
                required
              />
              {newActivity.startTime && newActivity.endTime && !isValidTimeRange() && (
                <p className="text-red-500 text-xs mt-1">
                  {convertTimeToMinutes(newActivity.endTime) <= convertTimeToMinutes(newActivity.startTime)
                    ? "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น"
                    : "ช่วงเวลานี้ซ้ำซ้อนกับกิจกรรมอื่น"}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700">รายละเอียด</label>
            <input
              type="text"
              name="description"
              placeholder="รายละเอียด"
              value={newActivity.description || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-sm"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm text-gray-700">โค้ช (Coach)</label>
              <button
                type="button"
                onClick={() => setIsCoachSelectOpen(true)}
                className="flex items-center text-sm text-blue-500 hover:text-blue-700"
              >
                <Plus size={16} className="mr-1" /> เลือกโค้ช
              </button>
            </div>
            
            {/* Display selected trainer */}
            {newActivity.trainer && newActivity.trainer.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newActivity.trainer.map(coach => (
                  <div key={coach.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
                    <span>{coach.name}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveCoach(coach.id)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`px-3 py-1 text-white rounded-lg text-sm ${
                newActivity.startTime && newActivity.endTime && isValidTimeRange() && newActivity.description && newActivity.trainer?.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!newActivity.startTime || !newActivity.endTime || !isValidTimeRange() || !newActivity.description || !newActivity.trainer?.length}
            >
              เพิ่ม
            </button>
          </div>
        </form>
      </div>
      
      {/* Coach Selection Modal */}
      {isCoachSelectOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="w-[500px] p-6 shadow-lg bg-white rounded-lg relative">
            <button
              onClick={() => setIsCoachSelectOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-sm"
            >
              ✕
            </button>
            <h3 className="text-base font-medium mb-4">เลือกโค้ช</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {trainer.map(trainerItem => (
                <button
                  key={trainerItem.id}
                  type="button"
                  className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAddCoach(trainerItem)}
                >
                  <img
                    src={trainerItem.image_url}
                    alt={trainerItem.Nickname}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <p className="mt-1 text-sm font-semibold">{trainerItem.Nickname}</p>
                  <p className="text-xs text-gray-500">{trainerItem.gym}</p>
                </button>
              ))}
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
  setNewActivity: PropTypes.func.isRequired
};