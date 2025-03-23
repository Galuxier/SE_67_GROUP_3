import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import ActivityModal from "../../components/courses/ActivityModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function CourseFrom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const { imageCourse } = location.state || {};
  // รับค่าข้อมูลคอร์สจาก state หรือ localStorage
  const courseData = state?.formDataEdit || JSON.parse(localStorage.getItem("courseData"));
  
  const [activities, setActivities] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [totalDays, setTotalDays] = useState(1);
  const [courseDates, setCourseDates] = useState({});
  
  // ปรับปรุง newActivity state
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [],
    date: ""
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
  
      // ตรวจสอบการอัปเดต totalDays
      if (totalDays !== diffDays) {
        setTotalDays(diffDays);  // อัปเดตเฉพาะเมื่อ totalDays เปลี่ยนแปลง
      }
      
      // สร้างรายการวันที่ในรูปแบบ DD/MM และ YYYY-MM-DD
      const dates = [];
      const isoDateFormat = [];
      for (let i = 0; i < diffDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
  
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
  
        dates.push(`${day}/${month}`);
        isoDateFormat.push(`${year}-${month}-${day}`);
      }
  
      // ตั้งค่ารายการวันที่เป็น object
      setCourseDates({
        display: dates,
        iso: isoDateFormat
      });
    }
  }, [courseData, totalDays]); // รวมทั้ง courseData และ totalDays ใน dependency array
  
  
  
  // โหลดกิจกรรมที่บันทึกไว้
  useEffect(() => {
    // ตรวจสอบว่ามีกิจกรรมใน courseData หรือไม่
    if (courseData?.activities && courseData.activities.length > 0) {
      setActivities(courseData.activities);
    } else {
      // โหลดจาก localStorage ถ้าไม่มีใน courseData
      const savedActivities = JSON.parse(localStorage.getItem("activities")) || [];
      setActivities(savedActivities);
    }
  }, [courseData]);
  
  // อัพเดต newActivity เมื่อ currentDay เปลี่ยน (ใช้รูปแบบเดียวกับ EditCourseFrom)
  useEffect(() => {
    if (courseDates.iso && courseDates.iso.length > 0) {
      setNewActivity(prev => ({
        ...prev,
        date: courseDates.iso[currentDay - 1]
      }));
    }
  }, [currentDay, courseDates.iso]);

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
  
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
  
    // Formatting activities data
    const form = new FormData();

  // เพิ่มข้อมูลพื้นฐานของคอร์ส
  form.append('image_url', courseData?.image_url || "");
  form.append('gym', courseData?.gym || "");
  form.append('course_name', courseData?.course_name || "");
  form.append('level', courseData?.level || "");
  form.append('startDate', courseData?.startDate || "");
  form.append('endDate', courseData?.endDate || "");
  form.append('price', courseData?.price || "");
  form.append('description', courseData?.description || "");
  form.append('imageCourse',imageCourse);


  // จัดการข้อมูลกิจกรรม
  // เพิ่มจำนวนกิจกรรมทั้งหมด
  form.append('total_activities', activities.length);
  
  // วนลูปเพิ่มข้อมูลกิจกรรมทีละรายการ
  activities.forEach((activity, index) => {
    // ข้อมูลพื้นฐานของกิจกรรม
    form.append(`activity_${index}_id`, activity.id || `new_activity_${index}`);
    form.append(`activity_${index}_description`, activity.description || "");
    
    // จัดการวันที่ของกิจกรรม - ใช้วันที่จากกิจกรรม หรือวันแรกของคอร์ส หรือค่าเริ่มต้น
    const activityDate = activity.date || 
                         (courseDates.iso && courseDates.iso.length > 0 ? 
                          courseDates.iso[0] : "2025-01-01");
    form.append(`activity_${index}_date`, activityDate);
    
    // เวลาเริ่มและสิ้นสุดกิจกรรม
    form.append(`activity_${index}_startTime`, activity.startTime || "");
    form.append(`activity_${index}_endTime`, activity.endTime || "");

    // จัดการข้อมูลเทรนเนอร์/โค้ช
    if (activity.coachDetails && activity.coachDetails.length > 0) {
      // กรณีมีข้อมูลโค้ชแบบละเอียด
      form.append(`activity_${index}_total_trainer`, activity.coachDetails.length);
      
      activity.coachDetails.forEach((coach, coachIndex) => {
        form.append(`activity_${index}_trainer_${coachIndex}_id`, coach.id || "");
        form.append(`activity_${index}_trainer_${coachIndex}_name`, coach.name || "");
        // if (coach.email) form.append(`activity_${index}_coach_${coachIndex}_email`, coach.email);
        // if (coach.phone) form.append(`activity_${index}_coach_${coachIndex}_phone`, coach.phone);
      });
    } else if (activity.trainer) {
      // กรณีมีข้อมูลเทรนเนอร์แบบอาร์เรย์
      const trainers = Array.isArray(activity.trainer) ? activity.trainer : [activity.trainer];
      
      form.append(`activity_${index}_total_trainers`, trainers.length);
      
      trainers.forEach((trainer, trainerIndex) => {
        form.append(`activity_${index}_trainer_${trainerIndex}`, trainer || "");
      });
    } else {
      // กรณีไม่มีข้อมูลเทรนเนอร์
      form.append(`activity_${index}_total_trainers`, 0);
    }
  });
  
  form.forEach((value, key) => {
    if (key === "imageCourse") {
      console.log(`File name: ${value.name}`); // Prints file name
    } else {
      console.log(`${key}: ${value}`);
    }
  });
    try {
      // Make API call or handle form submission to save
      // const response = await apiCall(formData);
  
      // Logging for debugging
      //console.log("Final course data:", form);
  
      // Clearing temporary data
      localStorage.removeItem("courseData");
      localStorage.removeItem("activities");
      // Redirect to course list page
      navigate("/course");
    } catch (error) {
      console.error("Error submitting course data:", error);
    }
  };


  // กรองกิจกรรมตามวันที่แสดง (ใช้ date แทน day เหมือน EditCourseFrom)
  const filteredActivities = activities.filter((activity) => {
    // ตรวจสอบว่ามี courseDates.iso และมีวันที่ปัจจุบัน
    const currentDateIso = courseDates.iso ? courseDates.iso[currentDay - 1] : null;
    
    // กรองเฉพาะกิจกรรมที่มี date ตรงกับวันที่กำลังดูอยู่
    return activity.date === currentDateIso;
  });

  // ดึงวันที่ปัจจุบัน
  const currentDateString = courseDates.display ? courseDates.display[currentDay - 1] : "";

  // ฟังก์ชันช่วยแสดงชื่อโค้ชในรูปแบบที่ต้องการ
  const formatCoachDisplay = (act) => {
    if (act.coachDetails) {
      return act.coachDetails.map(coach => coach.name).join(", ");
    } else if (act.trainer) {
      return Array.isArray(act.trainer) ? act.trainer.join(", ") : act.trainer;
    }
    return "";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[1000px] p-10 shadow-lg bg-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Course : {courseData?.course_name || "ไม่พบชื่อคอร์ส"}
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
                  className="px-4 py-1 bg-rose-600 text-white rounded-lg text-sm"
                >
                  back
                </button>
              )}
              {currentDay < totalDays && (
                <button 
                  onClick={handleNextDay}
                  className="px-4 py-1 bg-rose-600 text-white rounded-lg text-sm"
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
                <th className="p-2 border">Trainer</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="text-center">
                    <td className="p-2 border">
                      {act.startTime} - {act.endTime}
                    </td>
                    <td className="p-2 border">{act.description}</td>
                    <td className="p-2 border">{formatCoachDisplay(act)}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    ไม่มีกิจกรรมในวันนี้
                  </td>
                </tr>
              )}
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
              onClick={handleCourseSubmit}
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
        currentDate={courseDates.iso ? courseDates.iso[currentDay - 1] : ""}
        newActivity={newActivity}       
        setNewActivity={setNewActivity} 
      />
    </div>
  );
}