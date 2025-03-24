/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { updateUser } from "../../services/api/UserApi";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaLine,
  FaPen,
  FaTimes,
  FaCheck,
  FaChevronLeft,
} from "react-icons/fa";

const ProfileEditModal = ({ isOpen, onClose, userData, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    contact_info: {
      line: "",
      facebook: "",
      phone: ""
    }
  });

  const [activeTab, setActiveTab] = useState("profile");
  
  // Image cropping states
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.5 } },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
  };

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        bio: userData.bio || "",
        contact_info: {
          line: userData.contact_info?.line || "",
          facebook: userData.contact_info?.facebook || "",
          phone: userData.phone || ""
        }
      });
      
      // Initialize profile picture if available
      if (userData.profile_picture_url) {
        setImage(userData.profile_picture_url);
      }
    }
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setTempImage(reader.result);
        setIsCropping(true);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle crop complete
  const onCropComplete = (croppedArea, croppedAreaPixelsData) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  };

  // Create a cropped image from the selected file
  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = tempImage;
      
      // Wait for image to load
      await new Promise((resolve) => {
        image.onload = resolve;
      });
      
      // Create canvas for cropped image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Set canvas dimensions to match cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      // Draw cropped image onto canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      // Convert canvas to blob
      const croppedImage = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 0.95);
      });
      
      // Create a file from the blob
      const croppedFile = new File([croppedImage], "profile-picture.jpg", {
        type: "image/jpeg"
      });
      
      return { file: croppedFile, preview: URL.createObjectURL(croppedImage) };
    } catch (error) {
      console.error("Error creating cropped image:", error);
      toast.error("Error cropping image. Please try again.");
      return null;
    }
  };

  // Apply crop and set the cropped image
  const applyCrop = async () => {
    const result = await createCroppedImage();
    if (result) {
      setImage(result.preview);
      setFormData(prev => ({
        ...prev,
        profile_picture: result.file
      }));
      setIsCropping(false);
      setTempImage(null);
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create FormData for sending to API
      const submitData = new FormData();
      
      // Append basic profile info
      submitData.append("first_name", formData.first_name);
      submitData.append("last_name", formData.last_name);
      submitData.append("bio", formData.bio);
      
      // Append contact info
      submitData.append("contact_info", JSON.stringify({
        line: formData.contact_info.line,
        facebook: formData.contact_info.facebook
      }));
      
      // Append phone number
      submitData.append("phone", formData.contact_info.phone);
      
      // Append profile picture if it exists
      if (formData.profile_picture) {
        submitData.append("profile_picture_url", formData.profile_picture);
      }
      
      // Update user profile
      const result = await updateUser(userData._id, submitData);
      
      // Show success message
      toast.success("Profile updated successfully!");
      
      // Call onSave with the updated user data
      onSave(result);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder image if no profile picture
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Render the modal content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-5">
            <div className="flex flex-col items-center">
              {/* Profile Picture Section */}
              <div className="relative mb-5 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-100 dark:border-rose-900/30">
                  <img 
                    src={image || userData?.profile_picture_url || defaultAvatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-rose-600 text-white p-2 rounded-full shadow-lg hover:bg-rose-700 transition-colors"
                >
                  <FaCamera />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="First Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-gray-500">
                  <FaPen />
                </span>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-5">
            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  name="contact_info.phone"
                  value={formData.contact_info.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Line ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Line ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaLine />
                </span>
                <input
                  type="text"
                  name="contact_info.line"
                  value={formData.contact_info.line}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="Your Line ID"
                />
              </div>
            </div>

            {/* Facebook Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Facebook
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaFacebook />
                </span>
                <input
                  type="text"
                  name="contact_info.facebook"
                  value={formData.contact_info.facebook}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="Your Facebook profile"
                />
              </div>
            </div>

            {/* Email Field (Read Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  value={userData?.email || ""}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Your email address"
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Your Profile</h3>
              <button
                className="text-white hover:text-rose-200 transition-colors"
                onClick={onClose}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Cropping Interface */}
            {isCropping && (
              <div className="absolute inset-0 z-10 bg-black bg-opacity-90 flex flex-col">
                <div className="p-4 text-white flex justify-between items-center bg-gray-900">
                  <button onClick={cancelCrop} className="flex items-center text-rose-300 hover:text-rose-100">
                    <FaChevronLeft className="mr-2" /> Back
                  </button>
                  <h4 className="text-xl font-medium">Crop Your Photo</h4>
                  <div></div> {/* Empty div for flexbox alignment */}
                </div>
                
                <div className="flex-grow relative">
                  <Cropper
                    image={tempImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                
                <div className="p-4 bg-gray-900">
                  <div className="mb-4">
                    <label className="text-white text-sm mb-1 block">Zoom</label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelCrop}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyCrop}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className={`px-4 py-3 text-sm font-medium focus:outline-none ${
                    activeTab === "profile"
                      ? "text-rose-600 border-b-2 border-rose-600 dark:text-rose-400 dark:border-rose-400"
                      : "text-gray-600 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-300"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className={`px-4 py-3 text-sm font-medium focus:outline-none ${
                    activeTab === "contact"
                      ? "text-rose-600 border-b-2 border-rose-600 dark:text-rose-400 dark:border-rose-400"
                      : "text-gray-600 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-300"
                  }`}
                  onClick={() => setActiveTab("contact")}
                >
                  Contact Information
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>

              {/* Form Actions */}
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" className="mr-2" />
                      Saving
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileEditModal;