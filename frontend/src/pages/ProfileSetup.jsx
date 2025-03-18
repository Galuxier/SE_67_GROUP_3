import { useState, useRef } from "react";
import { updateUser } from "../services/api/UserApi";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

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
      setProfileData({
        ...profileData,
        profilePicture: file
      });
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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
      
      // Update user profile
      await updateUser(user._id, formData);
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 bg-background">
      <div className="bg-card p-6 rounded-lg shadow-md max-w-lg w-full border border-border">
        {/* Profile setup header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text">Setup your profile</h2>
          <p className="text-sm text-text/70 mt-1">Complete your profile to get the most out of your experience</p>
        </div>
        
        <div className="mt-6">
          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-6">
            <div 
              className="relative w-24 h-24 rounded-full bg-background border-2 border-border overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text/50">
                  <FaCamera size={24} />
                </div>
              )}
              <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <FaCamera className="text-white" size={20} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="space-y-4">
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="Tell us about yourself"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text resize-none"
              />
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-medium text-text mb-2">Contact Information</h3>
              
              <div className="space-y-2">
                <div>
                  <label htmlFor="phone" className="block text-xs text-text/70">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="contactInfo.phone"
                    placeholder="Your phone number"
                    value={profileData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text"
                  />
                </div>
                
                <div>
                  <label htmlFor="line" className="block text-xs text-text/70">
                    Line ID
                  </label>
                  <input
                    type="text"
                    id="line"
                    name="contactInfo.line"
                    placeholder="Your Line ID"
                    value={profileData.contactInfo.line}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text"
                  />
                </div>
                
                <div>
                  <label htmlFor="facebook" className="block text-xs text-text/70">
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="contactInfo.facebook"
                    placeholder="Your Facebook profile"
                    value={profileData.contactInfo.facebook}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-background text-text"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-text/50 text-sm hover:text-primary transition-colors"
            >
              Skip for now
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition-colors duration-300 disabled:opacity-70"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;