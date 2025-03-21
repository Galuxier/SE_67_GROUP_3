import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../services/api/UserApi";
import { FaCamera } from "react-icons/fa";
import { BsTelephone, BsLinkedin, BsFacebook, BsCheckCircleFill } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";

const ProfileSetup = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    bio: "",
    contactInfo: {
      phone: "",
      line: "",
      facebook: ""
    }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [step, setStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  
  // For image cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempFile, setTempFile] = useState(null);

  // Calculate progress percentage based on current step
  const progressPercent = (step / 4) * 100;
  
  // Step names for the stepper
  const stepNames = ["Welcome", "Photo", "Bio", "Contact"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixelsData) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  };

  const createCroppedImage = async () => {
    if (!previewImage || !croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = previewImage;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Set canvas dimensions to the cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      // Draw the cropped area onto the canvas
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
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          // Create a File object from the blob
          const croppedFile = new File([blob], "profile_picture.png", {
            type: "image/png",
          });
          
          // Set the cropped image as the profile picture
          setProfileData((prevState) => ({
            ...prevState,
            profilePicture: croppedFile
          }));
          
          // Create a URL for preview
          const previewUrl = URL.createObjectURL(blob);
          setPreviewImage(previewUrl);
          
          resolve();
        }, "image/png");
      });
    } catch (error) {
      console.error("Error creating cropped image:", error);
      toast.error("Error cropping image. Please try again.");
    }
  };

  const handleCropSave = async () => {
    await createCroppedImage();
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setPreviewImage(null);
    setTempFile(null);
  };

  const handleSkip = () => {
    navigate("/");
  };

  const handleNextStep = async () => {
    if (step === 2 && showCropper) {
      // Make sure to save cropped image before advancing
      await handleCropSave();
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create FormData
      const formData = new FormData();
      
      if (profileData.profilePicture) {
        formData.append('profile_picture', profileData.profilePicture);
      }
      
      formData.append('bio', profileData.bio);
      
      const contactInfo = {
        phone: profileData.contactInfo.phone,
        line: profileData.contactInfo.line,
        facebook: profileData.contactInfo.facebook
      };
      
      formData.append('contact_info', JSON.stringify(contactInfo));
      // console.log("user: ", user._id);
      // Update user profile
      const res = await updateUser(user._id, formData);
      console.log(res);
      
      
      // Show success state
      // setFormComplete(true);
      
      // Redirect to home page after a delay
      // setTimeout(() => {
      //   navigate('/');
      // }, 2000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.2 } }
  };

  // Render the welcome screen
  const renderWelcomeScreen = () => (
    <motion.div
      key="welcome"
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="h-20 w-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <BsCheckCircleFill className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
      </motion.div>
      
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Welcome to Muay Thai, {user?.first_name || 'Fighter'}!
      </motion.h2>
      
      <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 mb-8">
        Let's set up your profile to help you get the most out of your experience.
      </motion.p>
      
      <motion.div variants={itemVariants} className="flex gap-4 justify-center">
        <button
          onClick={handleSkip}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Skip for now
        </button>
        
        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
        >
          Let's go!
        </button>
      </motion.div>
    </motion.div>
  );

  // Render the profile picture step
  const renderProfilePictureStep = () => (
    <motion.div
      key="profile-picture"
      className="text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Choose a profile picture
      </motion.h2>
      
      <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 mb-6">
        Add a photo to help others recognize you
      </motion.p>
      
      {showCropper ? (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative h-64 w-full">
            <Cropper
              image={previewImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="mt-4 mb-2">
            <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zoom
            </label>
            <input
              type="range"
              id="zoom"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleCropCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCropSave}
              className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg"
            >
              Save Crop
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div 
            className="relative w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer group"
            onClick={() => fileInputRef.current.click()}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <FaCamera size={30} />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <FaCamera className="text-white" size={24} />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </motion.div>
      )}
      
      {!showCropper && (
        <motion.div variants={itemVariants} className="flex gap-4 justify-center mt-6">
          <button
            onClick={handlePrevStep}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
          >
            Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  // Render the bio step
  const renderBioStep = () => (
    <motion.div
      key="bio"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-center">
        Tell us about yourself
      </motion.h2>
      
      <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Share your experience with Muay Thai and what you're looking to achieve
      </motion.p>
      
      <motion.div variants={itemVariants}>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          placeholder="Tell us about your Muay Thai experience, interests, or goals..."
          value={profileData.bio}
          onChange={handleInputChange}
          className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex gap-4 justify-center mt-6">
        <button
          onClick={handlePrevStep}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );

  // Render the contact info step
  const renderContactInfoStep = () => (
    <motion.div
      key="contact-info"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-center">
        Your Contact Information
      </motion.h2>
      
      <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        How would you like others to get in touch with you?
      </motion.p>
      
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center">
          <div className="w-10 flex items-center justify-center mr-3">
            <BsTelephone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <input
            type="tel"
            name="contactInfo.phone"
            placeholder="Phone Number"
            value={profileData.contactInfo.phone}
            onChange={handleInputChange}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
        
        <div className="flex items-center">
          <div className="w-10 flex items-center justify-center mr-3">
            <BsLinkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <input
            type="text"
            name="contactInfo.line"
            placeholder="Line ID"
            value={profileData.contactInfo.line}
            onChange={handleInputChange}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
        
        <div className="flex items-center">
          <div className="w-10 flex items-center justify-center mr-3">
            <BsFacebook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <input
            type="text"
            name="contactInfo.facebook"
            placeholder="Facebook"
            value={profileData.contactInfo.facebook}
            onChange={handleInputChange}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex gap-4 justify-center mt-6">
        <button
          onClick={handlePrevStep}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <ClipLoader size={20} color="#ffffff" />
              <span className="ml-2">Saving...</span>
            </div>
          ) : (
            "Complete Setup"
          )}
        </button>
      </motion.div>
    </motion.div>
  );

  // Render the success screen
  const renderSuccessScreen = () => (
    <motion.div
      key="success"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <motion.div variants={itemVariants} className="h-20 w-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
        <BsCheckCircleFill className="h-10 w-10 text-green-600 dark:text-green-400" />
      </motion.div>
      
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Your profile is ready!
      </motion.h2>
      
      <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 mb-6">
        Thanks for setting up your profile. You're all set to explore the Muay Thai community!
      </motion.p>
      
      <motion.div 
        variants={itemVariants}
        className="animate-pulse"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Redirecting to home page...
        </p>
      </motion.div>
    </motion.div>
  );

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8 max-w-md mx-auto">
      <h2 className="sr-only">Steps</h2>
      <div>
        <div className="overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <ol className="mt-4 grid grid-cols-4 text-sm font-medium text-gray-500">
          {stepNames.map((name, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === step;
            const isCompleted = stepNumber < step || formComplete;
            
            return (
              <li 
                key={name}
                className={`flex items-center justify-center gap-1.5 ${
                  isActive || isCompleted ? "text-primary" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span className="hidden sm:inline">{name}</span>
                {stepNumber === 1 && (
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
                {stepNumber === 2 && (
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {stepNumber === 3 && (
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                {stepNumber === 4 && (
                  <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );

  // Main render function
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <ToastContainer />
      
      {renderStepIndicator()}
      
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {step === 1 && renderWelcomeScreen()}
          {step === 2 && renderProfilePictureStep()}
          {step === 3 && renderBioStep()}
          {step === 4 && renderContactInfoStep()}
          {formComplete && renderSuccessScreen()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSetup;