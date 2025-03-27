import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaLine } from "react-icons/fa";
import { PencilSquareIcon, CalendarIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getGymFromId } from "../../services/api/GymApi";
import { getImage } from "../../services/api/ImageApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import EditGymModal from "../../components/gyms/EditGymModal";
import TrainerList from "../../components/Trainer";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ImageViewer from "../../components/ImageViewer";

const GymDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const stickyRef = useRef(null);
  const { user } = useAuth();
  
  // Image viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Sample upcoming courses
  const [upcomingCourses, setUpcomingCourses] = useState([
    {
      id: 1,
      name: "Beginner Muay Thai",
      startDate: "April 15, 2025",
      endDate: "May 30, 2025",
      price: 2500,
      spots: 5,
      level: "Beginner"
    },
    {
      id: 2,
      name: "Advanced Clinching Techniques",
      startDate: "April 20, 2025",
      endDate: "June 10, 2025",
      price: 3500,
      spots: 3,
      level: "Advanced"
    },
    {
      id: 3,
      name: "Kids Muay Thai",
      startDate: "May 1, 2025",
      endDate: "June 30, 2025",
      price: 2000,
      spots: 8,
      level: "Beginner"
    }
  ]);
  
  // Animation for sections
  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [trainersRef, trainersInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [facilitiesRef, facilitiesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Check if user is the owner of the gym
  const isGymOwner = user && gym && user._id === gym.owner_id;
  
  // Fetch gym data
  useEffect(() => {
    const fetchGym = async () => {
      try {
        setLoading(true);
        const response = await getGymFromId(id);
        setGym(response);

        // ดึง URL ของรูปภาพทั้งหมด
        if (response.gym_image_url && response.gym_image_url.length > 0) {
          const urls = await Promise.all(
            response.gym_image_url.map(async (imageUrl) => {
              try {
                return await getImage(imageUrl);
              } catch (error) {
                console.error("Error fetching image:", error);
                // Return a placeholder image URL for failed images
                return "https://via.placeholder.com/800x500?text=Image+Not+Available";
              }
            })
          );
          setImageUrls(urls);
        } else {
          // If no images, use placeholder
          setImageUrls([
            "https://via.placeholder.com/800x500?text=No+Images+Available",
            "https://via.placeholder.com/800x500?text=Muay+Thai+Gym"
          ]);
        }
      } catch (error) {
        console.error("Error fetching gym profile:", error);
        setError("Failed to load gym details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGym();
  }, [id]);
  
  const handleSave = (updatedGym) => {
    setGym(updatedGym);
    setIsModalOpen(false);
  };
  
  const handleCourseClick = (courseId) => {
    // Navigate to course detail page
    navigate(`/course/${courseId}`);
  };
  
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };
  
  const getLevelBadgeColor = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text">
        <div className="text-5xl text-red-500 mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <button 
          onClick={() => navigate('/gym')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          Back to Gyms
        </button>
      </div>
    );
  }

  if (!gym) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Image Slider - Smaller size */}
      <div className="relative w-full h-[40vh] md:h-[50vh] max-w-7xl mx-auto mt-4 rounded-lg overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <img 
                  src={url} 
                  alt={`${gym.gym_name} - Image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity duration-300">
                  <span className="text-white bg-grey bg-opacity-10 px-4 py-2 rounded-lg shadow-lg">
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Gym Name and Location - Moved below the images */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text">
              {gym.gym_name}
            </h1>
            <div className="flex items-center text-text/70 mt-2">
              <FaMapMarkerAlt className="mr-2 text-text" />
              <p className="text-lg text-text">
                {gym.address?.district}, {gym.address?.province}
              </p>
            </div>
          </div>
          
          {/* Only show edit button for gym owner */}
          {isGymOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Navigation Tabs */}
            <div className="border-b border-border mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-4 px-1 font-medium text-lg text-text border-b-2 ${
                    activeTab === "about"
                      ? "border-primary text-primary"
                      : "border-transparent text-text/70 hover:text-text hover:border-border"
                  } transition-colors`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("trainers")}
                  className={`py-4 px-1 font-medium text-lg text-text border-b-2 ${
                    activeTab === "trainers"
                      ? "border-primary text-primary"
                      : "border-transparent text-text/70 hover:text-text hover:border-border"
                  } transition-colors`}
                >
                  Trainers
                </button>
                <button
                  onClick={() => setActiveTab("facilities")}
                  className={`py-4 px-1 font-medium text-lg text-text border-b-2 ${
                    activeTab === "facilities"
                      ? "border-primary text-primary"
                      : "border-transparent text-text/70 hover:text-text hover:border-border"
                  } transition-colors`}
                >
                  Facilities
                </button>
              </nav>
            </div>
            
            {/* About Section */}
            <div 
              ref={aboutRef}
              className={`${activeTab === "about" ? "block" : "hidden"}`}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-3xl font-bold text-text mb-6 relative">
                  About Us
                  <span className="absolute -bottom-2 left-0 w-20 h-1 bg-primary"></span>
                </h2>
                
                <div className="prose prose-lg max-w-none text-text dark:prose-invert">
                  <p className="text-lg">
                    {gym.description || "No description available for this gym."}
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="bg-card rounded-lg p-6 shadow-md border border-border/20 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-4 text-text">Contact Information</h3>
                    <div className="space-y-3">
                      {gym.contact?.tel && (
                        <div className="flex items-center">
                          <FaPhone className="text-primary w-5 h-5 mr-3" />
                          <span className="text-text">{gym.contact.tel}</span>
                        </div>
                      )}
                      {gym.contact?.email && (
                        <div className="flex items-center">
                          <FaEnvelope className="text-primary w-5 h-5 mr-3" />
                          <span className="text-text">{gym.contact.email}</span>
                        </div>
                      )}
                      {gym.contact?.facebook && (
                        <div className="flex items-center">
                          <FaFacebook className="text-primary w-5 h-5 mr-3" />
                          <span className="text-text">{gym.contact.facebook}</span>
                        </div>
                      )}
                      {gym.contact?.line && (
                        <div className="flex items-center">
                          <FaLine className="text-primary w-5 h-5 mr-3" />
                          <span className="text-text">{gym.contact.line}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="bg-card rounded-lg p-6 shadow-md border border-border/20 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-4 text-text">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-primary w-5 h-5 mr-3 mt-1" />
                        <div>
                          <p className="text-text">
                            {gym.address?.street || ""} {gym.address?.subdistrict || ""}<br />
                            {gym.address?.district}, {gym.address?.province} {gym.address?.postal_code}
                          </p>
                          {gym.address?.information && (
                            <p className="text-text/70 text-sm mt-1">{gym.address.information}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex items-center justify-center">
                      <div className="text-text/70">
                        Map placeholder
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Trainers Section */}
            <div 
              ref={trainersRef}
              className={`${activeTab === "trainers" ? "block" : "hidden"}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={trainersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-3xl font-bold text-text mb-6 relative">
                  Our Trainers
                  <span className="absolute -bottom-2 left-0 w-20 h-1 bg-primary"></span>
                </h2>
                
                <div className="mt-6">
                  <TrainerList />
                </div>
                
                <div className="mt-8 p-6 bg-card border border-border/20 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-text">Looking for more trainers?</h3>
                  <p className="text-text/80 mb-4">
                    Interested in joining our team as a trainer? Contact us to learn more about opportunities.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors">
                    Apply as Trainer
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Facilities Section */}
            <div 
              ref={facilitiesRef}
              className={`${activeTab === "facilities" ? "block" : "hidden"}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={facilitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-3xl font-bold text-text mb-6 relative">
                  Facilities
                  <span className="absolute -bottom-2 left-0 w-20 h-1 bg-primary"></span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Placeholder facility items */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-card border border-border/20 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-text mb-2">
                        {["Ring Area", "Heavy Bags", "Fitness Corner", "Shower Rooms", "Lockers", "Air Conditioning"][index]}
                      </h3>
                      <p className="text-text/70">
                        {[
                          "Professional full-size boxing ring for training and sparring",
                          "Multiple heavy bags for striking practice",
                          "Strength and conditioning equipment",
                          "Clean shower facilities with hot water",
                          "Secure storage for personal belongings",
                          "Climate controlled training environment"
                        ][index]}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Right Column - Sticky Upcoming Courses */}
          <div className="w-full lg:w-1/3">
            <div 
              ref={stickyRef}
              className="sticky top-28 bg-card border border-border/20 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Upcoming Courses</h2>
                <p className="text-white/80">Join our next training sessions</p>
              </div>
              
              <div className="p-6">
                {upcomingCourses.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingCourses.map(course => (
                      <div 
                        key={course.id}
                        onClick={() => handleCourseClick(course.id)}
                        className="bg-background border border-border/10 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-text">{course.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadgeColor(course.level)}`}>
                            {course.level}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-text/70">
                            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                            <span>{course.startDate} - {course.endDate}</span>
                          </div>
                          
                          <div className="flex items-center text-text/70">
                            <UserGroupIcon className="w-4 h-4 mr-2 text-primary" />
                            <span>{course.spots} spots available</span>
                          </div>
                          
                          <div className="mt-3 flex items-end justify-between">
                            <div className="text-text font-bold">
                              ฿{course.price.toLocaleString()}
                            </div>
                            <button className="text-xs px-3 py-1 bg-primary hover:bg-secondary text-white rounded-full transition-colors">
                              Enroll Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4 text-primary">
                      <ClockIcon className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-text/70">No upcoming courses available</p>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <button className="w-full px-4 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors">
                    View All Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        images={imageUrls}
        currentIndex={currentImageIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />

      {/* Modal for editing gym */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <EditGymModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            gymData={gym}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
};

export default GymDetail;