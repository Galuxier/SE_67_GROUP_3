import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import Calendar from "react-calendar"; // ใช้ react-calendar
import "react-calendar/dist/Calendar.css"; // นำเข้า styles ของ react-calendar

export default function CourseDetail() {
  const location = useLocation();
  const course = location.state?.course || {};
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imageURLs, setImageURLs] = useState({});
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // สถานะสำหรับการแสดงป๊อปอัพ
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  

  
  // ฟังก์ชัน fetchImage
  const fetchImage = async (imageUrl, courseId) => {
    try {
      const response = await fetch(`/api/images/${imageUrl}`);
      if (!response.ok) {
        console.error("Failed to fetch image:", response.statusText);
        return;
      }
      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImageURLs((prevURLs) => ({ ...prevURLs, [courseId]: imageObjectURL }));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // ใช้ useEffect เพื่อโหลดภาพเมื่อคอร์สถูก render
  useEffect(() => {
    if (course.course_image_url && course.course_image_url.length > 0) {
      fetchImage(course.course_image_url[0], course._id); // ดึงภาพจาก URL
    }
  }, [course]);

  // ฟังก์ชันสำหรับการกรองกิจกรรมที่ตรงกับวันที่ที่เลือก
  useEffect(() => {
    const filtered = course.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate >= new Date(course.start_date) &&
        activityDate <= new Date(course.end_date) &&
        activityDate.toDateString() === selectedDate.toDateString() // เปรียบเทียบวันที่
      );
    });
    setFilteredActivities(filtered);
  }, [selectedDate, course]);

  // ฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้เลือกวันที่ในปฏิทิน
  const handleDateChange = (date) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(7, 0, 0, 0);
    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);

    if (selectedDate >= startDate && selectedDate <= endDate) {
      setSelectedDate(date); // อัปเดต selectedDate
    } else {
      // ถ้าเลือกวันที่อยู่นอกช่วง start_date ถึง end_date
      setShowPopup(true); // แสดงป๊อปอัพ
      setPopupMessage(
        `คอร์สนี้มีวันที่เริ่มต้น: ${new Date(course.start_date).toLocaleDateString()} ถึง ${new Date(course.end_date).toLocaleDateString()}`
      );
    }
  };

  // ฟังก์ชันที่ใช้ในการปรับแต่งสีของวันที่ในปฏิทิน
  const tileClassName = ({ date }) => {
    const selectedDate = new Date(date);
    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);

    // ตรวจสอบวันที่มีกิจกรรม
    const activitiesOnDate = course.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate.toDateString() === selectedDate.toDateString();
    });

    // ถ้าวันที่เลือกอยู่ในช่วง start_date ถึง end_date และมีกิจกรรม
    if (
      selectedDate >= startDate &&
      selectedDate <= endDate &&
      activitiesOnDate.length > 0
    ) {
      return "bg-blue-800 text-yellow-500"; // สีเข้มสำหรับวันที่มีกิจกรรม
    } else if (selectedDate >= startDate && selectedDate <= endDate) {
      return "bg-blue-200"; // สีอ่อนสำหรับวันที่สามารถเลือกได้
    } else {
      return "bg-gray-100 cursor-not-allowed"; // สีวันที่ไม่สามารถเลือกได้
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{course.course_name}</h1>
          <p className="text-lg text-gray-600 mt-1">{course.gym}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/course/courseBuyFrom" state={{ course }}>
            <button className="bg-rose-600 text-white text-lg px-8 py-3 rounded-xl hover:bg-rose-600">
              ซื้อคอร์ส
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-center">
        {/* แสดงภาพจาก Blob URL หรือจาก URL ที่ได้จากเซิร์ฟเวอร์ */}
        <img
          src={imageURLs[course._id] || course.course_image_url[0]} // ใช้ Blob URL ถ้ามี หรือ URL จาก server
          alt={course.course_name}
          className="w-200 h-200 object-cover mt-4 rounded-lg"
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold">รายละเอียดคอร์ส</h2>
      <div className="mt-5 h-auto text-base text-gray-600 bg-gray-100 p-4 rounded-lg">
        <span>
          price: {course.price} บาท <br />
          level: {course.level} <br />
          <div className="text-gray-700 text-sm mt-2">
            <strong>Activities:</strong>
            <ul className="list-disc pl-5 mt-2">
              {course.activities.map((activity, index) => (
                <li key={index}>
                  {activity.description} on{" "}
                  {new Date(activity.date).toLocaleDateString()} at{" "}
                  {activity.start_time} - {activity.end_time} with{" "}
                  {activity.trainer.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        </span>
      </div>

      {/* แสดงปฏิทิน */}
      <div className="mt-8">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName} // เพิ่ม tileClassName เพื่อปรับสีของวันที่
        />
      </div>

      {/* แสดงกิจกรรมในวันที่เลือก */}
      {filteredActivities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            กิจกรรมในวันที่ {selectedDate.toLocaleDateString()}
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <ul className="list-disc pl-6 text-lg text-gray-700">
              {filteredActivities.map((activity, index) => (
                <li key={index} className="mb-4">
                  <div className="font-semibold text-lg text-blue-600">
                    กิจกรรม {activity.description}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>เวลา:</strong> {activity.start_time} -{" "}
                    {activity.end_time}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>โค้ช:</strong> {activity.trainer.join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

     

      {/* Popup วันที่ไม่สามารถเลือกได้ */}
      {showPopup && (
        <Dialog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-auto h-auto min-w-[300px] min-h-[200px] relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <Dialog.Title className="text-xl font-semibold">
              วันที่ที่เลือกไม่สามารถเลือกได้
            </Dialog.Title>
            <p className="mt-4 text-gray-700">{popupMessage}</p>
          </div>
        </Dialog>
      )}
    </div>
  );
}
