import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { CalendarIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { createCoure } from "../../../services/api/CourseApi";
import { toast } from "react-toastify";
import { trainer } from "../../../components/Trainer";
import ActivityModal from "../../../components/courses/ActivityModal";

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const { gym_id } = useParams();
  const { gymData } = useOutletContext() || {}; // Get gym data from context
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseData, setCourseData] = useState({
    gym_id: gym_id || "",
    course_name: "",
    price: "",
    description: "",
    level: "Beginner", // Default level
    start_date: "",
    end_date: "",
  });
  
  // Activity management
  const [activities, setActivities] = useState([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [newActivity, setNewActivity] = useState({
    startTime: "",
    endTime: "",
    description: "",
    trainer: [],
    date: "",
  });
  
  // Set the gym_id from the params or from the gymData
  useEffect(() => {
    if (gym_id) {
      setCourseData(prev => ({ ...prev, gym_id }));
    } else if (gymData && gymData._id) {
      setCourseData(prev => ({ ...prev, gym_id: gymData._id }));
    }
  }, [gym_id, gymData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate the number of days between start and end dates
  const getDaysArray = () => {
    if (!courseData.start_date || !courseData.end_date) return [];
    
    const start = new Date(courseData.start_date);
    const end = new Date(courseData.end_date);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return [];
    }
    
    const daysArray = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      daysArray.push({
        date: new Date(currentDate).toISOString().split('T')[0],
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return daysArray;
  };
  
  const days = getDaysArray();

  // Handle day click to open the activity modal
  const handleDayClick = (dayData) => {
    setCurrentDay(dayData.day);
    setCurrentDate(dayData.date);
    setNewActivity(prev => ({ ...prev, date: dayData.date }));
    setIsActivityModalOpen(true);
  };
  
  // Filter activities for a specific day
  const getActivitiesForDay = (date) => {
    return activities.filter(activity => activity.date === date);
  };
  
  // Generate a human readable time from 24-hour format
  const formatTime = (time) => {
    if (!time) return "";
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return time;
    }
  };
  
  // Handle activity deletion
  const handleRemoveActivity = (activityId) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  // Submit the course data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseData.course_name || !courseData.price || !courseData.start_date || !courseData.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (activities.length === 0) {
      toast.error("Please add at least one activity");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formData = {
        ...courseData,
        price: parseFloat(courseData.price),
        gym_id: courseData.gym_id || gymData._id,
        activities: activities
      };
      
      console.log("Submitting course data:", formData);
      
      // Call your API function
      const response = await createCoure(formData);
      
      toast.success("Course created successfully!");
      console.log("Course created:", response);
      
      // Navigate back to gym management page
      navigate(`/gym/management/${courseData.gym_id}`);
      
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-md border border-border/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="ml-1">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-center text-text flex-1">Create New Course</h1>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Course Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="course_name" className="block text-sm font-medium text-text mb-1">
              Course Name *
            </label>
            <input
              type="text"
              id="course_name"
              name="course_name"
              value={courseData.course_name}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
              placeholder="Enter course name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text mb-1">
              Price (THB) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={courseData.price}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
              placeholder="Enter price"
              min="0"
              required
            />
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-text mb-1">
              Level
            </label>
            <select
              id="level"
              name="level"
              value={courseData.level}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="ForKids">For Kids</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="gym_id" className="block text-sm font-medium text-text mb-1">
              Gym
            </label>
            <input
              type="text"
              id="gym_name"
              name="gym_name"
              value={gymData?.gym_name || "Current Gym"}
              className="w-full border border-border rounded-lg py-2 px-3 bg-gray-100 text-text"
              readOnly
            />
          </div>
          
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-text mb-1">
              Start Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={courseData.start_date}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
                required
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-text mb-1">
              End Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={courseData.end_date}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
                min={courseData.start_date}
                required
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-border rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
            placeholder="Describe your course"
          ></textarea>
        </div>
        
        {/* Course Schedule / Calendar */}
        <div className="border border-border/30 rounded-lg overflow-hidden">
          <div className="bg-primary/10 p-4 border-b border-border/30">
            <h3 className="font-medium text-text">Course Schedule</h3>
            <p className="text-sm text-text/70">Click on a day to add activities</p>
          </div>
          
          <div className="p-4">
            {days.length > 0 ? (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const dayActivities = getActivitiesForDay(day.date);
                  return (
                    <div 
                      key={day.date} 
                      onClick={() => handleDayClick(day)}
                      className={`border border-border/30 rounded-lg p-2 min-h-24 cursor-pointer hover:border-primary transition-colors ${
                        dayActivities.length > 0 ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="text-center mb-1">
                        <div className="text-sm font-medium text-text">
                          {day.day}
                        </div>
                        <div className="text-xs text-text/70">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </div>
                      </div>
                      
                      {dayActivities.length > 0 ? (
                        <div className="space-y-1">
                          {dayActivities.map((activity) => (
                            <div 
                              key={activity.id} 
                              className="text-xs p-1 bg-primary/10 rounded border border-primary/20 flex justify-between"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Option to edit activity could be added here
                              }}
                            >
                              <div className="truncate">{activity.description}</div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveActivity(activity.id);
                                }}
                                className="text-gray-500 hover:text-red-500 ml-1"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-12">
                          <PlusIcon className="h-5 w-5 text-text/30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-text/50">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-text/30" />
                <p>Select start and end dates to create a schedule</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Course...
              </>
            ) : (
              "Create Course"
            )}
          </button>
        </div>
      </form>
      
      {/* Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        setIsOpen={setIsActivityModalOpen}
        setActivities={setActivities}
        currentDay={currentDay || 0}
        currentDate={currentDate || ""}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
      />
    </div>
  );
};

export default CreateCourseForm;