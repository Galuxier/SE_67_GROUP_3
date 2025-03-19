import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AddressForm from "../../../components/forms/AddressForm";
import ContactForm from "../../../components/forms/ContactForm";

const AddGym = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [gymData, setGymData] = useState({
    gym_name: "",
    description: "",
    contact: {
      email: "",
      tel: "",
      line: "",
      facebook: ""
    },
    address: {},
  });

  const [filePreviews, setFilePreviews] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGymData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (contactData) => {
    setGymData((prev) => ({ ...prev, contact: contactData }));
  };

  const handleAddressChange = (addressData) => {
    setGymData((prev) => ({ ...prev, address: addressData }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // จำกัดจำนวนรูปภาพไม่เกิน 10 รูป
      if (files.length + filePreviews.length > 10) {
        alert("You can upload a maximum of 10 images.");
        return;
      }
      
      const previews = files.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => [...prev, ...previews]);
      setFileSelected(true);
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
    
    if (newPreviews.length === 0) {
      setFileSelected(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here would be your API call to save the gym data
    console.log("Submitting gym data:", gymData);
    
    // For demo purposes, let's just navigate back
    navigate("/gym");
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background pt-10 pb-10">
      <div className="w-full max-w-2xl p-8 shadow-lg bg-card rounded-lg overflow-y-auto border border-border/30">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="text-text/70 hover:text-primary flex items-center transition-colors mr-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-text flex-1 text-center">Add Gym</h1>
          <div className="w-9"></div> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Gym Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Gym Name</label>
            <input
              type="text"
              name="gym_name"
              value={gymData.gym_name}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
              placeholder="Enter gym name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Description</label>
            <textarea
              name="description"
              value={gymData.description}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-text"
              placeholder="Enter gym description"
              rows="4"
              required
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Contact Information</label>
            <div className="bg-background/50 p-4 rounded-lg border border-border/50">
              <ContactForm 
                initialData={gymData.contact}
                onChange={handleContactChange}
              />
            </div>
          </div>

          {/* Photos Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Photos</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-background/50">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                id="fileInput"
                accept="image/*"
                multiple
              />
              
              {filePreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded-lg border border-border/50"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-primary/80 rounded-full hover:bg-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <XMarkIcon className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors bg-background/30"
                  >
                    <PhotoIcon className="h-8 w-8 text-text/40" />
                    <span className="text-xs text-text/50 mt-1">Add More</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-full py-6 hover:bg-background/80 transition-colors"
                >
                  <PhotoIcon className="h-12 w-12 text-text/30" />
                  <p className="mt-2 text-sm text-text/60">
                    Click to upload photos
                  </p>
                  <p className="mt-1 text-xs text-text/40">
                    PNG, JPG up to 10 files
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Location</label>
            <div className="bg-background/50 p-4 rounded-lg border border-border/50">
              <AddressForm onChange={handleAddressChange} />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text">Facilities</label>
              <button 
                type="button"
                className="text-primary hover:text-secondary transition-colors flex items-center text-sm"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Add Facility
              </button>
            </div>
            <div className="border border-border/50 rounded-lg p-4 bg-background/50 flex items-center justify-center h-20">
              <p className="text-text/50 text-sm">No facilities added</p>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <span>Add Gym</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGym;