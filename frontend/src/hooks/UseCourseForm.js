import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createCoure } from "../services/api/CourseApi";
import { getDatesInRange } from "../utils/deleteUtil";

const useCourseForm = () => {
  const navigate = useNavigate();
  const { gymData } = useOutletContext() || {};
  const { gym_id } = useParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [courseData, setCourseData] = useState({
    course_name: "",
    description: "",
    level: "Beginner",
    price: "",
    max_participants: "",
    start_date: "",
    end_date: "",
    gym_id: gym_id || (gymData ? gymData._id : ""),
    gym_name: gymData ? gymData.gym_name : "",
    image_url: null,
    previewImage: null
  });
  
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [],
    date: ""
  });
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    if (!gymData && !gym_id) {
      toast.error("No gym data available. Please select a gym first.");
      navigate("/gym/management/gymlist");
    }
  }, [gymData, gym_id, navigate]);

  useEffect(() => {
    if (courseData.start_date && courseData.end_date) {
      try {
        const dateRange = getDatesInRange(courseData.start_date, courseData.end_date);
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
        previewImage: URL.createObjectURL(file)
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "start_date" && courseData.end_date && new Date(courseData.end_date) < new Date(value)) {
      setCourseData({ ...courseData, [name]: value, end_date: "" });
    } else {
      setCourseData({ ...courseData, [name]: value });
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!courseData.course_name || !courseData.description || !courseData.price) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!courseData.start_date || !courseData.end_date || new Date(courseData.end_date) < new Date(courseData.start_date)) {
          toast.error("Please set valid start and end dates");
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

  const goToNextStep = () => {
    if (currentStep < totalSteps && validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const formData = new FormData();
    Object.entries(courseData).forEach(([key, value]) => {
      if (key !== "previewImage" && value) formData.append(key, value);
    });
    formData.append("activities", JSON.stringify(activities));

    try {
      const response = await createCoure(formData);
      toast.success("Course created successfully!");
      // navigate(`/gym/management/${gym_id}`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  const handleAddActivity = (date, day) => {
    setCurrentDate(date.toISOString().split('T')[0]);
    setCurrentDay(day);
    setIsActivityModalOpen(true);
  };

  return {
    currentStep,
    totalSteps,
    courseData,
    activities,
    isActivityModalOpen,
    currentDay,
    currentDate,
    newActivity,
    availableDates,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    handleFileChange,
    handleInputChange,
    setIsActivityModalOpen,
    setActivities,
    setNewActivity,
    handleAddActivity,
  };
};

export default useCourseForm;