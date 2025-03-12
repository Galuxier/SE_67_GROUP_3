import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import ActivityModal from "../../components/courses/ActivityModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditCourseFrom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  // รับค่าข้อมูลคอร์สจาก state หรือ localStorage
  const courseD =
    state?.formDataEdit || JSON.parse(localStorage.getItem("formDataEdit"));

  const [activities, setActivities] = useState(courseD.activities || []);
  const [currentDay, setCurrentDay] = useState(1);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [totalDays, setTotalDays] = useState(1);
  const [courseDates, setCourseDates] = useState({});
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [],
    date: ""
  });

  // คำนวณวันทั้งหมดของคอร์สและสร้างรายการวันที่
  useEffect(() => {
    if (courseD?.startDate && courseD?.endDate) {
      // ฟังก์ชันสำหรับแปลงรูปแบบวันที่
      const parseDateString = (dateStr) => {
        // ตรวจสอบรูปแบบวันที่ DD/MM
        if (/^\d{2}\/\d{2}$/.test(dateStr)) {
          const [day, month] = dateStr.split("/");
          const currentYear = new Date().getFullYear();
          return new Date(currentYear, parseInt(month) - 1, parseInt(day));
        }
        // รูปแบบอื่นๆ
        return new Date(dateStr);
      };

      const startDate = parseDateString(courseD.startDate);
      const endDate = parseDateString(courseD.endDate);

      // คำนวณความต่างของวันและบวก 1 (เพื่อรวมวันเริ่มต้น)
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);

      // สร้างรายการวันที่ในรูปแบบ DD/MM และ YYYY-MM-DD
      const dates = [];
      const isoDateFormat = [];
      for (let i = 0; i < diffDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        dates.push(`${day}/${month}`);
        isoDateFormat.push(`${year}-${month}-${day}`);
      }

      // ตั้งค่ารายการวันที่
      setCourseDates({
        display: dates,
        iso: isoDateFormat,
      });
    }
  }, [courseD]);

  // โหลดกิจกรรมที่บันทึกไว้
  useEffect(() => {
    if (courseD?.activities && courseD.activities.length > 0) {
      setActivities(courseD.activities);
    } else {
      // โหลดจาก localStorage ถ้าไม่มีใน courseD
      const savedActivities =
        JSON.parse(localStorage.getItem("activities")) || [];
      setActivities(savedActivities);
    }
  }, [courseD]);

  // อัพเดต newActivity เมื่อ currentDay เปลี่ยน
  useEffect(() => {
    if (courseDates.iso && courseDates.iso.length > 0) {
      setNewActivity((prev) => ({
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
      setCurrentDay((prev) => prev + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 1) {
      setCurrentDay((prev) => prev - 1);
    }
  };

  const handleCreateCourse = () => {
    // เตรียมข้อมูลสำหรับสร้างคอร์สเรียน
    // แปลงรูปแบบกิจกรรมให้ตรงตามที่ต้องการ
    const formattedActivities = activities.map((activity) => ({
      description: activity.description,
      date: activity.date || (courseDates.iso ? courseDates.iso[0] : "2025-01-01"),
      startTime: activity.startTime,
      endTime: activity.endTime,
      trainer: activity.coachDetails
        ? activity.coachDetails.map((coach) => coach.name)
        : activity.trainer || [],
    }));

    const finalcourseD = {
      image_url: courseD?.image_url || "",
      gym: courseD?.gym || "",
      course_name: courseD?.courseName || "",
      level: courseD?.level || "",
      startDate: courseD?.startDate || "",
      endDate: courseD?.endDate || "",
      price: courseD?.price || "",
      description: courseD?.description || "",
      activities: formattedActivities,
    };
    // console.log(finalcourseD);
    
    // บันทึกข้อมูลคอร์สที่สมบูรณ์
    localStorage.setItem("completeCourse", JSON.stringify(finalcourseD));

    // นำทางไปยังหน้าแสดงรายการคอร์ส
    navigate("/course");

    // ล้างข้อมูลชั่วคราว
    localStorage.removeItem("completeCourse");
    localStorage.removeItem("formDataEdit");
    localStorage.removeItem("activities");
  };

  // กรองกิจกรรมตามวันที่แสดง (ใช้ date แทน day)
  const filteredActivities = activities.filter((activity) => {
    // ตรวจสอบว่ามี courseDates.iso และมีวันที่ปัจจุบัน
    const currentDateIso = courseDates.iso ? courseDates.iso[currentDay - 1] : null;
    
    // กรองเฉพาะกิจกรรมที่มี date ตรงกับวันที่กำลังดูอยู่
    return activity.date === currentDateIso;
  });

  // ดึงวันที่ปัจจุบัน
  const currentDateString = courseDates.display
    ? courseDates.display[currentDay - 1]
    : "";

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[1000px] p-10 shadow-lg bg-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Course : {courseD?.courseName || "ไม่พบชื่อคอร์ส"}
          </label>
          <label className="block text-sm text-gray-600">
            time : {courseD?.startDate} - {courseD?.endDate}
          </label>
        </div>
        <br></br>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">Activity</h3>
            <span className="text-gray-500 text-sm">
              {currentDay} of {totalDays}{" "}
              {currentDateString ? `( ${currentDateString})` : ""}
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
                <th className="p-2 border">Coach</th>
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
                    <td className="p-2 border">
                      {act.coachDetails 
                        ? act.coachDetails.map(coach => coach.name).join(", ")
                        : act.trainer ? act.trainer.join(", ") : ""}
                    </td>
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
                  <td colSpan={4} className="p-4 text-center text-gray-500">
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
        currentDate={courseDates.iso ? courseDates.iso[currentDay - 1] : ""}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
      />
    </div>
  );
}