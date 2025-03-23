import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import ActivityModal from "../../../components/courses/ActivityModal";

// Step-based course creation form
const CreateCourseForm = () => {
  const navigate = useNavigate();
  const { gymData } = useOutletContext() || {};
  const { gym_id } = useParams();
  
  // Check if gymData is available
  useEffect(() => {
    if (!gymData && !gym_id) {
      toast.error("No gym data available. Please select a gym first.");
      navigate("/gym/management/gymlist");
    }
  }, [gymData, gym_id, navigate]);

  // States for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form data state
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
  
  // Activities state
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [],
    date: ""
  });
  
  // Modal state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  
  // Get dates between start and end date
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
  
  // Calculate available dates based on start and end date
  const [availableDates, setAvailableDates] = useState([]);
  
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
  
  // File upload handler
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
  
  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value
    });
  };

  // Navigation between steps
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
      navigate(-1); // Go back to previous page if on first step
    }
  };
  
  // Validate current step before proceeding
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Basic information
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
        
      case 2: // Schedule
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
        
      case 3: // Activities
        if (activities.length === 0) {
          toast.error("Please add at least one activity");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    // Format data for API
    const formData = new FormData();
    formData.append("course_name", courseData.course_name);
    formData.append("description", courseData.description);
    formData.append("level", courseData.level);
    formData.append("price", courseData.price);
    formData.append("max_participants", courseData.max_participants);
    formData.append("start_date", courseData.start_date);
    formData.append("end_date", courseData.end_date);
    formData.append("gym_id", courseData.gym_id);
    
    if (courseData.image_url) {
      formData.append("image_url", courseData.image_url);
    }
    
    // Add activities
    formData.append("activities", JSON.stringify(activities));
    
    try {
      // Simulate API call for now
      console.log("Submitting course:", Object.fromEntries(formData));
      
      // Success handling
      toast.success("Course created successfully!");
      navigate(`/gym/management/${gym_id}`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };
  
  // Handle opening the activity modal for a specific date
  const handleAddActivity = (date, day) => {
    setCurrentDate(date.toISOString().split('T')[0]);
    setCurrentDay(day);
    setIsActivityModalOpen(true);
  };
  
  // Render functions for each step
  const renderStepIndicator = () => {
    return (
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
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium ${
                  isActive 
                    ? "text-primary" 
                    : isCompleted 
                      ? "text-green-500" 
                      : "text-gray-500"
                }`}>
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
  };
  
  const renderBasicInfo = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-text">Course Name</label>
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
            <label className="block text-sm font-medium mb-1 text-text">Description</label>
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
            <label className="block text-sm font-medium mb-1 text-text">Level</label>
            <select
              name="level"
              value={courseData.level}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ForKids">For Kids</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-text">Price</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter price"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-text">Max Participants</label>
            <input
              type="number"
              name="max_participants"
              value={courseData.max_participants}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter max participants"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-text">Course Image</label>
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
  };
  
  const renderSchedule = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-text">Start Date</label>
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
            <label className="block text-sm font-medium mb-1 text-text">End Date</label>
            <input
              type="date"
              name="end_date"
              value={courseData.end_date}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>
        
        {availableDates.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3 text-text">Course Duration</h3>
            <div className="bg-card border border-border/40 rounded-lg p-4">
              <p className="mb-2 text-text">
                {courseData.start_date && courseData.end_date && 
                  `${availableDates.length} days from ${new Date(courseData.start_date).toLocaleDateString()} to ${new Date(courseData.end_date).toLocaleDateString()}`
                }
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
                {availableDates.map((date, index) => (
                  <div 
                    key={index}
                    className="border border-border/40 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleAddActivity(date, date.getDate())}
                  >
                    <span className="text-sm font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-xs text-text/70">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    
                    {/* Show indicator if there are activities for this date */}
                    {activities.some(activity => activity.date === date.toISOString().split('T')[0]) && (
                      <div className="mt-1 w-4 h-4 rounded-full bg-primary"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="mt-4 text-sm text-text/70">Click on a date to add activities</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderActivities = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-3 text-text">Course Activities</h3>
        
        {activities.length === 0 ? (
          <div className="text-center py-10 bg-card border border-border/40 rounded-lg">
            <p className="text-text/70">No activities added yet</p>
            <p className="text-sm text-text/50 mt-2">Click on a date in the calendar to add activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableDates.map((date, dateIndex) => {
              const dateString = date.toISOString().split('T')[0];
              const dayActivities = activities.filter(a => a.date === dateString);
              
              if (dayActivities.length === 0) return null;
              
              return (
                <div key={dateIndex} className="bg-card border border-border/40 rounded-lg p-4">
                  <h4 className="text-md font-medium mb-2 text-text">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  
                  <div className="space-y-2">
                    {dayActivities.map((activity, activityIndex) => (
                      <div 
                        key={activityIndex} 
                        className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/20"
                      >
                        <div>
                          <p className="font-medium text-text">{activity.description}</p>
                          <p className="text-sm text-text/70">
                            {activity.startTime} - {activity.endTime}
                          </p>
                        </div>
                        <div>
                          <div className="flex -space-x-2">
                            {activity.trainer.map((trainer, trainerIndex) => (
                              <div
                                key={trainerIndex}
                                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                title={trainer.name}
                              >
                                {trainer.name.charAt(0)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleAddActivity(date, date.getDate())}
                    className="mt-2 text-sm text-primary hover:text-secondary"
                  >
                    + Add more activities
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => {
              if (availableDates.length > 0) {
                handleAddActivity(availableDates[0], availableDates[0].getDate());
              } else {
                toast.error("Please set course start and end dates first");
                setCurrentStep(2);
              }
            }}
            className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
          >
            + Add Activity
          </button>
        </div>
      </div>
    );
  };
  
  const renderReview = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold mb-4 text-text">Course Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/40 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3 text-text">Basic Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text/70">Course Name:</span>
                <span className="font-medium text-text">{courseData.course_name}</span>
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
                <span className="font-medium text-text">{courseData.max_participants || "Unlimited"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/70">Gym:</span>
                <span className="font-medium text-text">{courseData.gym_name}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border/40 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3 text-text">Schedule</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text/70">Start Date:</span>
                <span className="font-medium text-text">{new Date(courseData.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/70">End Date:</span>
                <span className="font-medium text-text">{new Date(courseData.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/70">Duration:</span>
                <span className="font-medium text-text">{availableDates.length} days</span>
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
  };
  
  // Render the current step
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
      <h1 className="text-2xl font-bold mb-6 text-text text-center">Create New Course</h1>
      
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
      
      {/* Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
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