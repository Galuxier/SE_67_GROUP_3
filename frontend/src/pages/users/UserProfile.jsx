import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, getUser  } from "../../services/api/UserApi";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaLine,
  FaCalendarAlt,
  FaTrophy,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";
import ProfileEditModal from "../../components/users/ProfileEditModal";
import { getImage } from "../../services/api/ImageApi";

function UserProfile() {
  const { user } = useAuth(); // user ที่ล็อกอินอยู่
  const { encoded_id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null); // state สำหรับข้อมูลผู้ใช้ที่กำลังดู
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const decodeUserId = (encodedId) => {
    try {
      // Decode the ID using base64 and handle any necessary transformations
      // This is a simple example; you might want to use a more secure encoding
      return atob(encodedId);
    } catch (error) {
      console.error("Error decoding user ID:", error);
      return null;
    }
  };
  // ตรวจสอบว่าเป็นโปรไฟล์ของตัวเองหรือไม่
  const isCurrentUserProfile = user?._id === decodeUserId(encoded_id);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);

        const userId = decodeUserId(encoded_id);
        const response = await getUser(userId);
        setProfileUser(response);
        
        // Fetch profile image if available
        if (response.profile_picture_url) {
          try {
            const imageUrl = await getImage(response.profile_picture_url);
            setProfileImageUrl(imageUrl);
          } catch (imageError) {
            console.error("Error fetching profile image:", imageError);
            // Keep the default avatar in case of error
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (encoded_id) {
      fetchUserProfile();
    }
  }, [encoded_id]);

  const handleProfileUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
    
    // If the updated user has a profile picture, fetch it
    if (updatedUser.profile_picture_url) {
      getImage(updatedUser.profile_picture_url)
        .then(imageUrl => {
          setProfileImageUrl(imageUrl);
        })
        .catch(error => {
          console.error("Error fetching updated profile image:", error);
        });
    }
    
    setIsModalOpen(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Placeholder image if no profile picture
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Helper function to format creation date
  const formatCreationDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if user has specific roles
  const isBoxer = profileUser?.role?.includes('boxer');
  const isTrainer = profileUser?.role?.includes('trainer');

  // Sample data for boxer and trainer sections (replace with actual API calls in a real implementation)
  const fightHistory = [
    // { id: 1, event: "Bangkok Championship 2022", opponent: "Somchai P.", result: "Win", date: "2022-05-15" },
    // { id: 2, event: "Phuket Open Tournament", opponent: "John Smith", result: "Loss", date: "2022-07-22" },
    // { id: 3, event: "Chiang Mai Exhibition", opponent: "Tanawat S.", result: "Win", date: "2022-09-10" }
  ];

  const teachingHistory = [
    // { id: 1, course: "Beginner Muay Thai", gym: "Bangkok Fight Club", date: "Jan 2022 - Mar 2022", students: 12 },
    // { id: 2, course: "Advanced Clinch Techniques", gym: "Tiger Muay Thai", date: "Apr 2022 - Jun 2022", students: 8 }
  ];

  const openCourses = [
    // { id: 1, course: "Muay Thai for Fitness", gym: "Bangkok Fight Club", schedule: "Mon, Wed, Fri", slots: "5/10 filled" },
    // { id: 2, course: "Competition Preparation", gym: "Tiger Muay Thai", schedule: "Tue, Thu, Sat", slots: "3/6 filled" }
  ];

  return (
    <motion.main
      className="flex justify-center min-h-screen pt-10 pb-20 bg-gradient-to-br from-rose-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#E11D48" size={50} />
        </div>
      ) : error ? (
        <motion.section 
          className="w-full h-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mx-auto"
          variants={itemVariants}
        >
          <h3 className="text-2xl text-red-600 font-semibold text-center">{error}</h3>
        </motion.section>
      ) : (
        <div className="w-full max-w-5xl px-4">
          {/* Cover Background */}
          <motion.div 
            className="w-full h-48 md:h-64 bg-gradient-to-r from-rose-400 to-purple-500 rounded-t-2xl overflow-hidden relative"
            variants={itemVariants}
          >
            {/* Edit Button */}
            {isCurrentUserProfile && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg z-10"
                aria-label="Edit Profile"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            )}
          </motion.div>
          
          {/* Profile Picture - With improved positioning to show the complete image */}
          <motion.div 
            className="flex justify-center -mt-20 mb-4"
            variants={itemVariants}
          >
            <div className="relative w-40 h-40">
              <img
                src={profileImageUrl || defaultAvatar}
                alt={`${profileUser?.first_name}'s profile`}
                className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
              />
            </div>
          </motion.div>

          {/* Main Profile Content */}
          <motion.section 
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden pb-6 mt-4"
            variants={itemVariants}
          >
            {/* User Name and Role */}
            <div className="pt-6 pb-6 px-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {profileUser?.first_name} {profileUser?.last_name}
              </h1>
              <p className="text-rose-600 dark:text-rose-400 font-medium mt-1">
                {profileUser?.role?.map(r => r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ')).join(', ')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
                <FaCalendarAlt className="mr-2" />
                Joined {formatCreationDate(profileUser?.create_at)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
              {/* Bio Section */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 h-full shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">About Me</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {profileUser?.bio || "No biography available. " + (isCurrentUserProfile ? "Click edit to add your bio." : "")}
                  </p>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 h-full shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contact</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaEnvelope className="mr-3 text-rose-500" />
                      <span className="truncate">{profileUser?.email || "No email"}</span>
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaPhone className="mr-3 text-rose-500" />
                      <span>{profileUser?.phone || "No phone"}</span>
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaLine className="mr-3 text-rose-500" />
                      <span>{profileUser?.contact_info?.line || "No Line ID"}</span>
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <FaFacebook className="mr-3 text-rose-500" />
                      <span>{profileUser?.contact_info?.facebook || "No Facebook"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Role-specific sections */}
          
        </div>
      )}

      {/* Edit Profile Modal */}
      {isCurrentUserProfile && (
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={profileUser}
          onSave={handleProfileUpdate}
        />
      )}
    </motion.main>
  );
}

export default UserProfile;