import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getUser } from "../../services/api/UserApi"; // Make sure this is the correct import for the getUser function

export default function CourseDetail() {
  const location = useLocation();
  const course = location.state?.course || {};
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imageURLs, setImageURLs] = useState({});
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [trainersInfo, setTrainersInfo] = useState([]); // State to store fetched trainer info
  const [loadingTrainers, setLoadingTrainers] = useState(true); // Track loading state
  const navigate = useNavigate();

  // ฟังก์ชัน fetch image
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

  // useEffect to load image when course is rendered
  useEffect(() => {
    if (course.course_image_url && course.course_image_url.length > 0) {
      fetchImage(course.course_image_url[0], course._id); // Fetch image from URL
    }
  }, [course]);

  // Fetch additional information for trainers
  useEffect(() => {
    const fetchTrainerData = async () => {
      setLoadingTrainers(true); // Set loading state to true when fetching
      const trainerData = await Promise.all(
        course.activities.flatMap((activity) =>
          activity.trainer_list.map(async (trainer) => {
            try {
              const trainerDetails = await getUser(trainer.trainer_id); // Fetch trainer data by trainer_id
              // console.log("Fetched trainer details:", trainerDetails); // Log trainer details for debugging

              // Check if trainerDetails and trainerDetails.data are valid
              // console.log("test",trainerDetails.first_name);
              const fullName =
                trainerDetails?.first_name && trainerDetails?.last_name
                  ? `${trainerDetails.first_name} ${trainerDetails.last_name} (${trainerDetails.nickname})`
                  : "Unknown Trainer"; // Provide fallback if data is invalid
              // console.log(fullName);
              // Return merged trainer data with full name
              return { ...trainer, name: fullName };
            } catch (error) {
              console.error("Error fetching trainer data:", error);
              return { ...trainer, name: "Unknown Trainer" }; // In case of error, set name as "Unknown Trainer"
            }
          })
        )
      );
      // console.log("trainnerDate",trainerData);
      setTrainersInfo(trainerData); // Store fetched trainer data in state
      setLoadingTrainers(false); // Set loading state to false once data is fetched
    };

    if (course.activities.length > 0) {
      fetchTrainerData();
    }
  }, [course]);

  // ฟังก์ชันสำหรับกรองกิจกรรมที่ตรงกับวันที่ที่เลือก
  useEffect(() => {
    const filtered = course.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate >= new Date(course.start_date) &&
        activityDate <= new Date(course.end_date) &&
        activityDate.toDateString() === selectedDate.toDateString()
      );
    });
    setFilteredActivities(filtered);
  }, [selectedDate, course]);

  // ฟังก์ชันที่ใช้เมื่อผู้ใช้เลือกวันที่ในปฏิทิน
  const handleDateChange = (date) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(7, 0, 0, 0);
    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);

    if (selectedDate >= startDate && selectedDate <= endDate) {
      setSelectedDate(date); // Update selected date
    } else {
      // If the selected date is outside the range of start_date to end_date
      setShowPopup(true);
      setPopupMessage(
        `คอร์สนี้มีวันที่เริ่มต้น: ${new Date(
          course.start_date
        ).toLocaleDateString()} ถึง ${new Date(
          course.end_date
        ).toLocaleDateString()}`
      );
    }
  };

  // ฟังก์ชันสำหรับการปรับแต่งสีของวันที่ในปฏิทิน
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

  // ฟังก์ชันสำหรับการนำทางไปที่หน้าซื้อคอร์ส
  const handleBuyCourse = () => {
    navigate("/course/courseBuyFrom", { state: { course } });
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{course.course_name}</h1>
          <p className="text-lg text-gray-600 mt-1">{course.gym}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleBuyCourse}
            className="bg-rose-600 text-white text-lg px-8 py-3 rounded-xl hover:bg-rose-600"
          >
            ซื้อคอร์ส
          </button>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <img
          src={imageURLs[course._id] || course.course_image_url[0]}
          alt={course.course_name}
          className="w-full h-auto object-cover mt-4 rounded-lg"
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
                  {activity.trainer_list && activity.trainer_list.length > 0 ? (
                    activity.trainer_list.map((trainer, trainerIndex) => (
                      <span key={trainerIndex}>
                        {trainersInfo.find(
                          (t) => t.trainer_id === trainer.trainer_id
                        )?.name || "Unknown Trainer"}
                        {trainerIndex < activity.trainer_list.length - 1 &&
                          ", "}{" "}
                        {/* Add a comma except for the last trainer */}
                      </span>
                    ))
                  ) : (
                    <span>ไม่มีโค้ช</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </span>
      </div>

      <div className="mt-8">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>

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
                    <strong>โค้ช:</strong>{" "}
                    {activity.trainer_list &&
                    activity.trainer_list.length > 0 ? (
                      activity.trainer_list.map((trainer, trainerIndex) => (
                        <span key={trainerIndex}>
                          {/* Display trainer's name and separate with a comma except for the last one */}
                          {trainersInfo.find(
                            (t) => t.trainer_id === trainer.trainer_id
                          )?.name || "Unknown Trainer"}
                          {trainerIndex < activity.trainer_list.length - 1 &&
                            ", "}{" "}
                          {/* Add comma for all except the last one */}
                        </span>
                      ))
                    ) : (
                      <span>ไม่มีโค้ช</span> // Display if no trainers are present
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
