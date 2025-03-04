import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Plus } from "lucide-react";

export default function ActivityModal({ isOpen, setIsOpen, setActivities, currentDay }) {
  const [newActivity, setNewActivity] = useState({
    startTime: "", 
    endTime: "",
    description: "",
    coach: "",
    coaches: [], // Array to store multiple coaches
    day: currentDay
  });
  
  const [isCoachSelectOpen, setIsCoachSelectOpen] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [existingActivities, setExistingActivities] = useState([]);
  
  // Load trainers and existing activities on component mount
  useEffect(() => {
    // Load trainers data
    setTrainers([
      {
        id: 1,
        image_url: "../assets/images/coach1.jpg",
        firstName: "นายเก้า",
        lastName: "เท็นสิบ",
        Nickname: "โค้ชนาย",
        gym: "Phuket Fight Club",
      },
      {
        id: 2,
        image_url: "../assets/images/coach2.jpg",
        firstName: "นายสิบ",
        lastName: "สิบสาม",
        Nickname: "โค้ชอ้วน",
        gym: "Bangkok Fight Club",
      },
      {
        id: 3,
        image_url: "../assets/images/coach3.jpg",
        firstName: "นายสิบเอ็ด",
        lastName: "เจ็ดแปดเก้า",
        Nickname: "โค้ชเก่ง",
        gym: "Chiang Mai Fight Club",
      },
    ]);
    
    // Load existing activities from localStorage
    const savedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setExistingActivities(savedActivities);
  }, [isOpen]); // Reload when modal opens

  if (!isOpen) return null; // Don't render if modal is closed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddCoach = (trainer) => {
    // Check if coach is already selected
    if (!newActivity.coaches.some(coach => coach.id === trainer.id)) {
      const coachInfo = {
        id: trainer.id,
        name: trainer.Nickname,
        gym: trainer.gym
      };
      
      setNewActivity(prev => ({
        ...prev,
        coaches: [...prev.coaches, coachInfo]
      }));
    }
    
    setIsCoachSelectOpen(false);
  };
  
  const handleRemoveCoach = (coachId) => {
    setNewActivity(prev => ({
      ...prev,
      coaches: prev.coaches.filter(coach => coach.id !== coachId)
    }));
  };

  // Check if time range overlaps with existing activities for the same day
  const isTimeOverlapping = (start, end) => {
    const sameDayActivities = existingActivities.filter(activity => activity.day === currentDay);
    
    const newStartTime = convertTimeToMinutes(start);
    const newEndTime = convertTimeToMinutes(end);
    
    return sameDayActivities.some(activity => {
      const existingStartTime = convertTimeToMinutes(activity.startTime);
      const existingEndTime = convertTimeToMinutes(activity.endTime);
      
      // Check for any overlap
      return (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      );
    });
  };
  
  // Helper function to convert HH:MM to minutes for easier comparison
  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newActivity.startTime || !newActivity.endTime || !newActivity.description) {
      alert("กรุณากรอกข้อมูลเวลาและรายละเอียดให้ครบ");
      return;
    }
    
    // Validate that end time is after start time
    if (convertTimeToMinutes(newActivity.endTime) <= convertTimeToMinutes(newActivity.startTime)) {
      alert("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น");
      return;
    }
    
    // Check for time overlap
    if (isTimeOverlapping(newActivity.startTime, newActivity.endTime)) {
      alert("เวลานี้ซ้ำซ้อนกับกิจกรรมที่มีอยู่แล้ว กรุณาเลือกเวลาอื่น");
      return;
    }
    
    // Validate coach selection
    if (newActivity.coaches.length === 0 && !newActivity.coach) {
      alert("กรุณาเพิ่มโค้ชอย่างน้อย 1 คน หรือระบุชื่อโค้ช");
      return;
    }

    // Format coaches for display
    const formattedCoaches = newActivity.coaches.length > 0 
      ? newActivity.coaches.map(coach => coach.name).join(", ")
      : newActivity.coach;

    const newActivityData = {
      id: Date.now(),
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      description: newActivity.description,
      coach: formattedCoaches,
      coachDetails: newActivity.coaches,
      day: currentDay
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
      coach: "", 
      coaches: [],
      day: currentDay 
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="w-[700px] p-10 shadow-lg bg-white rounded-lg relative">
        {/* <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-sm"
        >
          ✕
        </button> */}
        <h3 className="text-base font-medium mb-3">เพิ่มกิจกรรม - วันที่ {currentDay}</h3>
        <form onSubmit={handleAddActivitySubmit} className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-700">เวลาเริ่มต้น</label>
              <input
                type="time"
                name="startTime"
                value={newActivity.startTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg text-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-700">เวลาสิ้นสุด</label>
              <input
                type="time"
                name="endTime"
                value={newActivity.endTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700">รายละเอียด</label>
            <input
              type="text"
              name="description"
              placeholder="รายละเอียด"
              value={newActivity.description}
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
            
            {/* Display selected coaches */}
            {newActivity.coaches.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newActivity.coaches.map(coach => (
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
            
            {/* Optional manual coach input */}
            {/* <input
              type="text"
              name="coach"
              placeholder="หรือระบุชื่อโค้ช"
              value={newActivity.coach}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-sm mt-2"
            /> */}
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
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
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
              {trainers.map(trainer => (
                <button
                  key={trainer.id}
                  type="button"
                  className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAddCoach(trainer)}
                >
                  <img
                    src={trainer.image_url}
                    alt={trainer.Nickname}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <p className="mt-1 text-sm font-semibold">{trainer.Nickname}</p>
                  <p className="text-xs text-gray-500">{trainer.gym}</p>
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
  currentDay: PropTypes.number.isRequired
};