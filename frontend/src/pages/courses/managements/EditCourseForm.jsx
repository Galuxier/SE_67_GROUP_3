import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import ActivityModal from "../../../components/courses/ActivityModal";
import { getCourseById ,updateCourse} from "../../../services/api/CourseApi";
import { X } from "lucide-react";
import { getUser } from '/src/services/api/UserApi.js';  // ใช้ named import
const CreateCourseForm = () => {
  const navigate = useNavigate();
  const { gymData } = useOutletContext() || {};
  const { gym_id,course_id} = useParams();
  // console.log(gym_id);
//   console.log(course_id);

  useEffect(() => {
    if (!gymData && !gym_id) {
      toast.error("No gym data available. Please select a gym first.");
      navigate("/gym/management/gymlist");
      console.log(gym_id);
    }
  }, [gymData, gym_id, navigate]);

  // ใช้ location เพื่อให้การเช็ค path เป็นไปตามการเปลี่ยนแปลง URL
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [courseFromList,setcourseFromList] = useState([]);
  const [courseData, setCourseData] = useState({
    course_name: "",
    description: "",
    level: "beginner",
    price: "",
    max_participants: "",
    start_date: "",
    end_date: "",
    gym_id: gym_id,
    image_url: null,
    previewImage: null,
  });
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await getCourseById(course_id);
        console.log(course);
        setcourseFromList(course);

      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
  
    if (course_id) {
      fetchCourse();
    }
    
  }, [course_id]);

//   activities
//   : 
//   Array(1)
//   0
//   : 
//   date
//   : 
//   "2025-03-25T00:00:00.000Z"
//   description
//   : 
//   "กกก"
//   end_time
//   : 
//   "16:00"
//   start_time
//   : 
//   "08:00"
//   trainer_list
//   : 
//   [{…}]
//   _id
//   : 
//   "67e50f2bb009a270db9cac68"
//   [[Prototype]]
//   : 
//   Object
//   length
//   : 
//   1
//   [[Prototype]]
//   : 
//   Array(0)
//   course_image_url
//   : 
//   ['courses/1743064875965-course_image_url.jfif']
//   course_name
//   : 
//   "สอนมวนเริ่มต้น(เทคนิค)"
//   description
//   : 
//   "เป็นการสอนง่ายด้านเทคนิค"
//   end_date
//   : 
//   "2025-03-25T00:00:00.000Z"
//   gym_id
//   : 
//   "67e41494a6a720488f39555b"
//   level
//   : 
//   "beginner"
//   max_participants
//   : 
//   6
//   packages
//   : 
//   []
//   price
//   : 
//   1500
//   start_date
//   : 
//   "2025-03-25T00:00:00.000Z"
//   status
//   : 
//   "preparing"
const [activities, setActivities] = useState([]);
useEffect(() => {
    const fetchData = async () => {
      if (courseFromList) {
        // ฟังก์ชันสำหรับแปลงวันที่ให้เป็นรูปแบบที่ต้องการ
        const formatDate = (date) => {
          const parsedDate = new Date(date);  // แปลง date เป็น Date object
          return parsedDate.toLocaleDateString("en-CA");  // แปลงเป็น "YYYY-MM-DD"
        };
  
        // แปลงข้อมูลกิจกรรมก่อนที่จะตั้งค่า
        const formattedActivities = Array.isArray(courseFromList.activities)
          ? await Promise.all(courseFromList.activities.map(async (activity) => {
              // เพิ่มข้อมูลสถานะของโค้ช
              const trainerWithStatus = await Promise.all(activity.trainer_list.map(async (trainer) => {
                const respon = await getUser(trainer.trainer_id);
                console.log("Trainer Info: ", respon);  // ตรวจสอบข้อมูลที่ได้จาก getUser
                
                // หาค่า status ของ trainer_id ใน trainer_in_course
                const trainerStatus = courseFromList.trainer_in_course.find(t => t.trainer_id === trainer.trainer_id);
                return {
                  trainer_id: trainer.trainer_id,
                  Nickname: respon.nickname,
                  gym_id : respon.gym_id,
                  name: respon.nickname,
                  id :respon._id,
                  status: trainerStatus ? trainerStatus.status : "unknown",  // กำหนด "unknown" หากไม่พบ status
                };
              }));
  
              return {
                ...activity,
                date: activity.date ? formatDate(activity.date) : "",  // ใช้ formatDate เพื่อแปลง date เป็น "YYYY-MM-DD"
                startTime: activity.start_time || "00:00",  // ใช้เวลาเริ่มต้น ถ้าไม่มีให้ใช้ "00:00"
                endTime: activity.end_time || "00:00",      // ใช้เวลาสิ้นสุด ถ้าไม่มีให้ใช้ "00:00"
                trainer: trainerWithStatus  // แทนที่ trainer_list ด้วย array ของ trainer_id, trainer_name และ status
              };
            }))
          : [];
  
        // ตั้งค่าค่า courseData
        setCourseData({
          course_name: courseFromList.course_name || "",
          description: courseFromList.description || "",
          level: courseFromList.level || "beginner",
          price: courseFromList.price || "",
          max_participants: courseFromList.max_participants || "",
          start_date: courseFromList.start_date ? formatDate(courseFromList.start_date) : "",
          end_date: courseFromList.end_date ? formatDate(courseFromList.end_date) : "",
          gym_id: courseFromList.gym_id || gym_id,
          image_url: courseFromList.course_image_url || null,
          previewImage: courseFromList.course_image_url && courseFromList.course_image_url[0]
            ? `http://10.35.145.93:3000/api/images/${courseFromList.course_image_url[0]}`
            : null
        });
  
        // ตั้งค่ากิจกรรมหลังการแปลงข้อมูล
        setActivities(formattedActivities);
      }
    };
  
    fetchData();
  }, [courseFromList, gym_id]);  // useEffect จะทำงานเมื่อ courseFromList หรือ gym_id เปลี่ยนแปลง
  
  
  

//    console.log("dataaaaaa",courseData);
   console.log("activity",activities);


  
   
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [], 
    date: "",
  });

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    if (courseData.start_date && courseData.end_date) {
      try {
        const dateRange = getDatesInRange(
          courseData.start_date,
          courseData.end_date
        );
        setAvailableDates(dateRange);
      } catch (error) {
        console.error("Error calculating date range:", error);
      }
    } else {
      setAvailableDates([]);
    }
  }, [courseData.start_date, courseData.end_date]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({
        ...courseData,
        image_url: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "start_date") {
      if (
        courseData.end_date &&
        new Date(courseData.end_date) < new Date(value)
      ) {
        setCourseData({
          ...courseData,
          [name]: value,
          end_date: "",
        });
      } else {
        setCourseData({
          ...courseData,
          [name]: value,
        });
      }
    } else {
      setCourseData({
        ...courseData,
        [name]: value,
      });
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };
  const handleDeleteActivity = (activityId) => {
    // Filter out the activity with the matching ID
    const updatedActivities = activities.filter(
      (activity) => activity.id !== activityId
    );

    // Update the activities state
    setActivities(updatedActivities);
  };
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!courseData.course_name) {
          toast.error("Please enter a course name");
          return false;
        }
        if (!courseData.description) {
          toast.error("Please provide a course description");
          return false;
        }
        if (!courseData.price) {
          toast.error("Please enter a price");
          return false;
        }
        return true;

      case 2:
        if (!courseData.start_date) {
          toast.error("Please enter a start date");
          return false;
        }
        if (!courseData.end_date) {
          toast.error("Please enter an end date");
          return false;
        }
        if (new Date(courseData.end_date) < new Date(courseData.start_date)) {
          toast.error("End date cannot be earlier than start date");
          return false;
        }
        return true;

      case 3:
        if (activities.length === 0) {
          toast.error("Please add at least one activity");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    const formData = new FormData();
    formData.append("course_name", courseData.course_name);
    formData.append("description", courseData.description);

    // แปลง level ให้ตรงกับที่ backend คาดหวัง
    if (courseData.level === "For Kids") {
      formData.append("level", "for_kid");
    } else if (courseData.level === "Beginner") {
      formData.append("level", "beginner");
    } else {
      formData.append("level", "advance");
    }

    formData.append("price", courseData.price);
    formData.append("max_participants", courseData.max_participants);

    // แปลง start_date และ end_date เป็น Date object ที่สามารถส่งไปยัง backend ได้
    formData.append(
      "start_date",
      new Date(courseData.start_date).toISOString()
    );
    formData.append("end_date", new Date(courseData.end_date).toISOString());

    formData.append("gym_id", courseData.gym_id);
    formData.append("status", "preparing");
    // formData.append("status", "ongoing");
    // formData.append("status", "finished");
    
    if (courseData.image_url) {
      formData.append("course_image_url", courseData.image_url);
    }
    // console.log("Activities:", activities);
    // แก้ไขให้ 'time' แสดงในรูปแบบ "startTime - endTime" และลบ startTime, endTime ออกจากข้อมูล
    const formattedActivities = activities.map((activity) => {
      return {
        description: activity.description, // Keep the description as it is
        date: new Date(activity.date).toISOString(), // Convert date to ISO string
        start_time: activity.startTime,
        end_time: activity.endTime,
        startTime: undefined, // Remove original startTime
        endTime: undefined, // Remove original endTime
        id: undefined, // Remove original id
        trainer_list: activity.trainer.map((trainer) => ({
          trainer_id: trainer.id, // Map trainer.id to trainer_id
          // status: trainer.statuses, 
        })),
      };
    });
    const trainer_in_course = activities.flatMap((activity) => {
        return activity.trainer.map((trainer) => ({
          trainer_id: trainer.id, // Map trainer.id to trainer_id
          status: trainer.statuses, // Map trainer status
          isMember: trainer.statuses === 'ready', // Conditional logic for isMenber
        }));
      });
      
      // กรอง trainer ที่มี trainer_id ซ้ำกัน
      const uniqueTrainers = trainer_in_course.filter((value, index, self) => {
        return index === self.findIndex((t) => t.trainer_id === value.trainer_id);
      });
      
      // ส่งข้อมูล trainer_in_course ที่ไม่ซ้ำกันไปยัง formData
      formData.append("trainer_in_course", JSON.stringify(uniqueTrainers));
    
    // console.log("trainnerINcourse",trainer_in_course);
    

    formData.append("activities", JSON.stringify(formattedActivities));
    // console.log("File to send:", courseData.image_url);
    // วิธีการแสดงข้อมูลใน FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await updateCourse(course_id,formData);
      console.log("Course created:", response);
      toast.success("Course created successfully!");
      navigate(`/gym/management/${gym_id}`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  const handleAddActivity = (date, day) => {
    // ตั้งค่า currentDate โดยใช้วันที่ที่เลือกในรูปแบบ YYYY-MM-DD
    setCurrentDate(date.toLocaleDateString("en-CA"));  // ใช้ "en-CA" เพื่อให้ได้รูปแบบ YYYY-MM-DD

    // ตั้งค่า currentDay ตามวันที่ที่เลือก
    setCurrentDay(day);

    // รีเซ็ตค่า newActivity และกำหนด currentDate ลงใน newActivity.date
    setNewActivity({
      startTime: "",   // เวลาเริ่มต้น
      endTime: "",     // เวลาสิ้นสุด
      description: "", // คำอธิบาย
      trainer: [],     // โค้ช
      date: date.toLocaleDateString("en-CA"),  // กำหนด currentDate ลงใน newActivity.date
    });

    // เปิด modal เพื่อเพิ่มกิจกรรม
    setIsActivityModalOpen(true);
};


  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? <CheckIcon className="w-6 h-6" /> : stepNumber}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {["Basic Info", "Schedule", "Activities", "Review"][index]}
              </p>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text">
            Course Name
          </label>
          <input
            type="text"
            name="course_name"
            value={courseData.course_name}
            onChange={handleInputChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter course name"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text">
            Description
          </label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter course description"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">
            Level
          </label>
          <select
            name="level"
            value={courseData.level}
            onChange={handleInputChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="beginner">Beginner</option>
            <option value="advance">Advanced</option>
            <option value="for_kid">For Kids</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-text/90">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              handleInputChange({
                target: {
                  name: "price",
                  value: value,
                },
              });
            }}
            min="1"
            className="w-full border border-border dark:border-border/70 rounded-lg py-2 px-3 bg-background dark:bg-background/10 text-text dark:text-text/90 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary/70"
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text dark:text-text/90">
            Max Participants
          </label>
          <input
            type="number"
            name="max_participants"
            value={courseData.max_participants}
            onChange={(e) => {
              // Remove any decimal part and ensure minimum of 1
              const value = Math.max(1, Math.floor(Number(e.target.value)));
              handleInputChange({
                target: {
                  name: "max_participants",
                  value: value,
                },
              });
            }}
            min="1"
            pattern="\d+"
            onKeyDown={(e) => {
              // Prevent decimal point input
              if (e.key === "." || e.key === ",") {
                e.preventDefault();
              }
            }}
            className="w-full border border-border dark:border-border/70 rounded-lg py-2 px-3 bg-background dark:bg-background/10 text-text dark:text-text/90 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary/70"
            placeholder="Enter max participants"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text">
            Course Image
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="course-image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="course-image"
              className="cursor-pointer flex-1 border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {courseData.image_url ? "Change Image" : "Upload Image"}
            </label>
          </div>
          {courseData.previewImage && (
            <div className="mt-2">
              <img
                src={courseData.previewImage}
                alt="Course Preview"
                className="h-24 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-text">
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            value={courseData.start_date}
            onChange={handleInputChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            value={courseData.end_date}
            onChange={handleInputChange}
            min={courseData.start_date}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
      </div>
      {availableDates.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-text">
            Course Duration
          </h3>
          <div className="bg-card border border-border/40 rounded-lg p-4">
            <p className="mb-2 text-text">
              {courseData.start_date &&
                courseData.end_date &&
                `${availableDates.length} days from ${new Date(
                  courseData.start_date
                ).toLocaleDateString()} to ${new Date(
                  courseData.end_date
                ).toLocaleDateString()}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
              {availableDates.map((date, index) => (
                <div
                  key={index}
                  className="border border-border/40 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleAddActivity(date, date.getDate())}
                >
                  <span className="text-sm font-medium">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-text/70">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  {activities.some(
                    (activity) =>
                      activity.date === date.toISOString().split("T")[0]
                  ) && (
                    <div className="mt-1 w-4 h-4 rounded-full bg-primary"></div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-text/70">
              Click on a date to add activities
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <h3 className="text-base font-medium mb-3 text-text dark:text-text/90">
        Course Activities
      </h3>
      {activities.length === 0 ? (
        <div className="text-center py-8 bg-card dark:bg-card/20 border border-border/40 dark:border-border/20 rounded-lg">
          <p className="text-sm text-text/70 dark:text-text/60">
            No activities added yet
          </p>
          <p className="text-xs text-text/50 dark:text-text/40 mt-2">
            Click on a date in the calendar to add activities
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {availableDates.map((date, dateIndex) => {
            const dateString = date.toISOString().split("T")[0];
            const dayActivities = activities.filter(
              (a) => a.date === dateString
            );

            if (dayActivities.length === 0) return null;

            return (
              <div
                key={dateIndex}
                className="bg-card dark:bg-card/20 border border-border/40 dark:border-border/20 rounded-lg p-4"
              >
                <h4 className="text-sm font-medium mb-2 text-text dark:text-text/90">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                <div className="space-y-2">
                  {dayActivities.map((activity, activityIndex) => (
                    <div
                      key={activity.id || activityIndex}
                      className="flex items-center justify-between p-3 bg-background dark:bg-background/10 rounded-lg border border-border/20 dark:border-border/10"
                    >
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text/90">
                          {activity.description}
                        </p>
                        <p className="text-xs text-text/70 dark:text-text/60">
                          {activity.startTime} - {activity.endTime}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Coaches with Gym */}
                        <div className="flex flex-col mt-2">
                          <div className="mb-2">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              Coaches in Gym
                            </h4>
                            <div className="flex space-x-2">
                              {activity.trainer
                                .filter(
                                  (trainer) =>
                                     trainer.gym_id === gym_id
                                ) // Check if gym_id matches
                                .map((trainerItem) => (
                                  <div
                                    key={trainerItem._id}
                                    className="flex items-center p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                      {trainerItem.Nickname}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Coaches without Gym */}
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              Coaches out Gym
                            </h4>
                            <div className="flex space-x-2">
                              {activity.trainer
                                .filter(
                                  (trainer) =>
                                    !trainer.gym_id || trainer.gym_id !== gym_id
                                ) // Check if gym_id doesn't match or if no gym
                                .map((trainerItem) => (
                                  <div
                                    key={trainerItem._id}
                                    className="flex items-center p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                      {trainerItem.Nickname}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddActivity(date, date.getDate())}
                  className="mt-2 text-xs text-primary dark:text-primary/80 hover:text-secondary dark:hover:text-secondary/80"
                >
                  + Add more activities
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4 text-text">Course Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-text">
            Basic Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Course Name:</span>
              <span className="font-medium text-text">
                {courseData.course_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Level:</span>
              <span className="font-medium text-text">{courseData.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Price:</span>
              <span className="font-medium text-text">฿{courseData.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Max Participants:</span>
              <span className="font-medium text-text">
                {courseData.max_participants || "Unlimited"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Gym:</span>
              <span className="font-medium text-text">
                {courseData.gym_name}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-text">Schedule</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Start Date:</span>
              <span className="font-medium text-text">
                {new Date(courseData.start_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">End Date:</span>
              <span className="font-medium text-text">
                {new Date(courseData.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Duration:</span>
              <span className="font-medium text-text">
                {availableDates.length} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Total Activities:</span>
              <span className="font-medium text-text">{activities.length}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border/40 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3 text-text">Description</h4>
        <p className="text-text">{courseData.description}</p>
      </div>
      <div className="bg-card border border-border/40 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3 text-text">Course Image</h4>
        {courseData.previewImage ? (
          <img
            src={courseData.previewImage}
            alt="Course Preview"
            className="h-40 object-cover rounded-md"
          />
        ) : (
          <p className="text-text/70">No image uploaded</p>
        )}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderSchedule();
      case 3:
        return renderActivities();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-card border border-border/30 rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-text text-center">
       Update Course 
      </h1>
      {renderStepIndicator()}
      <form onSubmit={handleSubmit}>
        {renderCurrentStep()}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="flex items-center px-4 py-2 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-text transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="flex items-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
            >
              Create Course
              <CheckIcon className="h-5 w-5 ml-1" />
            </button>
          )}
        </div>
      </form>
      <ActivityModal
        isOpen={isActivityModalOpen}
        activities={activities}
        setIsOpen={setIsActivityModalOpen}
        setActivities={setActivities}
        currentDay={currentDay}
        currentDate={currentDate}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
      />
    </div>
  );
};

export default CreateCourseForm;
