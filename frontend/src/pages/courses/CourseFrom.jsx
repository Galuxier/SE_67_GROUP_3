import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import ActivityModal from "../../components/courses/ActivityModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function CourseFrom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // รับค่าข้อมูลคอร์สจาก state หรือ localStorage
  const courseData = state?.formDataEdit || JSON.parse(localStorage.getItem("courseData"));
  
  const [activities, setActivities] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [totalDays, setTotalDays] = useState(1);
  const [courseDates, setCourseDates] = useState([]);
  
  // สร้าง newActivity state ในหน้า CourseFrom โดยตรง
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [],
    day: currentDay
  });
  
  // คำนวณวันทั้งหมดของคอร์สและสร้างรายการวันที่
  useEffect(() => {
    if (courseData?.startDate && courseData?.endDate) {
      // ฟังก์ชันสำหรับแปลงรูปแบบวันที่
      const parseDateString = (dateStr) => {
        // ตรวจสอบรูปแบบวันที่ DD/MM
        if (/^\d{2}\/\d{2}$/.test(dateStr)) {
          const [day, month] = dateStr.split('/');
          const currentYear = new Date().getFullYear();
          return new Date(currentYear, parseInt(month) - 1, parseInt(day));
        } 
        // รูปแบบอื่นๆ
        return new Date(dateStr);
      };
      
      const startDate = parseDateString(courseData.startDate);
      const endDate = parseDateString(courseData.endDate);
      
      // คำนวณความต่างของวันและบวก 1 (เพื่อรวมวันเริ่มต้น)
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays  !== Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1) {
       setTotalDays(diffDays);
      }
      
      // สร้างรายการวันที่ในรูปแบบ DD/MM
      const dates = [];
      for (let i = 0; i < diffDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        dates.push(`${day}/${month}`);
      }
      
      setCourseDates(dates);
    }
  }, [courseData]);
  
  // โหลดกิจกรรมที่บันทึกไว้
  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(savedActivities);
  }, []);
  
  // อัพเดต day ใน newActivity เมื่อ currentDay เปลี่ยน
  useEffect(() => {
    setNewActivity(prev => ({
      ...prev,
      day: currentDay
    }));
  }, [currentDay]);

  const handleBack = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า
  };

  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter(
      (activity) => activity.id !== id
    );
    setActivities(updatedActivities);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
  };
  
  const handleNextDay = () => {
    if (currentDay < totalDays) {
      setCurrentDay(prev => prev + 1);
    }
  };
  
  const handlePrevDay = () => {
    if (currentDay > 1) {
      setCurrentDay(prev => prev - 1);
    }
  };
  
  const handleCreateCourse = () => {
    // เตรียมข้อมูลสำหรับสร้างคอร์สเรียน
    const finalCourseData = {
      ...courseData,
      activities: activities
    };
    
    // บันทึกข้อมูลคอร์สที่สมบูรณ์
    localStorage.setItem("completeCourse", JSON.stringify(finalCourseData));
    console.log(finalCourseData);
    // นำทางไปยังหน้าแสดงรายการคอร์ส
    navigate("/course");
    
    // ล้างข้อมูลชั่วคราว
    localStorage.removeItem("courseData");
    localStorage.removeItem("activities");
  };

  // กรองกิจกรรมตามวันที่แสดง
  const filteredActivities = activities.filter(activity => {
    return activity.day === currentDay || !activity.day; // แสดงกิจกรรมตามวันปัจจุบัน
  });

  // ดึงวันที่ปัจจุบัน
  const currentDateString = courseDates[currentDay - 1] || "";

  // ฟังก์ชันช่วยแสดงชื่อโค้ชในรูปแบบที่ต้องการ - แสดงชื่อจริง
  const formatCoachDisplay = (coachString) => {
    if (!coachString) return "";
    
    return coachString;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[1000px] p-10 shadow-lg bg-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Course : {courseData?.courseName || "ไม่พบชื่อคอร์ส"}
          </label>
          <label className="block text-sm text-gray-600">
           time : {courseData?.startDate} - {courseData?.endDate}
          </label>
        </div>
        <br></br>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">Activity</h3>
            <span className="text-gray-500 text-sm">
              {currentDay} of {totalDays} {currentDateString ? `( ${currentDateString})` : ""}
            </span>
            <div className="flex gap-2">
              {currentDay > 1 && (
                <button 
                  onClick={handlePrevDay}
                  className="px-4 py-1 bg-rose-600 text-white rounded-lg  text-sm"
                >
                  back
                </button>
              )}
              {currentDay < totalDays && (
                <button 
                  onClick={handleNextDay}
                  className="px-4 py-1 bg-rose-600 text-white rounded-lg  text-sm"
                >
                  next
                </button>
              )}
            </div>
          </div>

          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Coach</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((act) => (
                <tr key={act.id} className="text-center">
                  <td className="p-2 border">
                    {act.startTime} - {act.endTime}
                  </td>
                  <td className="p-2 border">{act.description}</td>
                  <td className="p-2 border">{formatCoachDisplay(act.coach)}</td>
                  <td className="p-2 border">
                    <button className="text-blue-500 mr-2">
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteActivity(act.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsAddActivityModalOpen(true)}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex justify-between gap-3 mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
            >
              Back
            </button>

            <button 
              onClick={handleCreateCourse}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm"
            >
              สร้าง Course
            </button>
          </div>
        </div>
      </div>

      <ActivityModal
        isOpen={isAddActivityModalOpen}
        setIsOpen={setIsAddActivityModalOpen}
        setActivities={setActivities}
        currentDay={currentDay}
        newActivity={newActivity}       
        setNewActivity={setNewActivity} 
      />
    </div>
  );
}