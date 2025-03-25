import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { 
  PhotoIcon, 
  ArrowUpTrayIcon, 
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import AddressForm from "../../../components/forms/AddressForm";

const AddPlace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    googleMapsLink: "",
    address: {
      province: "",
      district: "",
      subdistrict: "",
      postal_code: "",
      street: "",
      information: ""
    },
    coordinates: { lat: 13.7563, lng: 100.5018 } // Bangkok
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  }, []);

  const handleAddressChange = useCallback((addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData,
    }));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreview];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreview(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      toast.error("You must be logged in to create a place");
      return;
    }
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    try {
      setLoading(true);
      const placeFormData = new FormData();
      placeFormData.append("owner_id", user._id);
      placeFormData.append("name", formData.name);
      placeFormData.append("price", formData.price);
      placeFormData.append("googleMapsLink", formData.googleMapsLink);
      placeFormData.append("address", JSON.stringify(formData.address));
      images.forEach((image) => placeFormData.append("images", image));
      
      // Simulated API call
      console.log("Form data to be submitted:", {
        owner_id: user._id,
        name: formData.name,
        price: formData.price,
        googleMapsLink: formData.googleMapsLink,
        address: formData.address,
        images: images.map(img => img.name)
      });
      
      toast.success("Place created successfully!");
      navigate("/place/management/list");
    } catch (error) {
      console.error("Error creating place:", error);
      toast.error(error.message || "Failed to create place");
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name) {
          toast.error("Please enter a place name");
          return false;
        }
        if (!formData.price) {
          toast.error("Please enter a price");
          return false;
        }
        return true;
      case 2:
        if (!formData.address.province || !formData.address.district || !formData.address.subdistrict) {
          toast.error("Please complete the address information");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault(); // Prevent form submission
    if (currentStep < totalSteps && validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = (e) => {
    e.preventDefault(); // Prevent form submission
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
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
                  isActive ? "border-primary bg-primary text-white" : 
                  isCompleted ? "border-green-500 bg-green-500 text-white" : 
                  "border-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? <CheckIcon className="w-6 h-6" /> : stepNumber}
              </div>
              <p className={`mt-2 text-xs font-medium ${
                isActive ? "text-primary" : 
                isCompleted ? "text-green-500" : 
                "text-gray-500"
              }`}>
                {["Basic Info", "Address", "Review"][index]}
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
          <label className="block text-sm font-medium mb-1 text-text">Place Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter place name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Price per Day (THB)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Google Maps Link <span className="text-gray-500 text-xs">(Optional)</span></label>
          <input
            type="url"
            name="googleMapsLink"
            value={formData.googleMapsLink}
            onChange={handleChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. https://maps.google.com/?q=..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Paste a link to the location on Google Maps to help renters find your place easily
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-text">
            Place Images <span className="text-primary">*</span>
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:hover:bg-gray-700/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <PhotoIcon className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG, GIF (MAX. 5MB each)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>
          </div>
          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative group h-24 w-full">
                  <div className="h-full w-full overflow-hidden rounded-md border border-border">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-6 bg-card/50">
        <h3 className="text-lg font-medium mb-4 text-text">Address Information</h3>
        <AddressForm onChange={handleAddressChange} initialData={formData.address} />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-text">Location Preview</h3>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
          <p className="text-text/60">Map preview will be available here</p>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Actual location will be determined based on the address provided or Google Maps link
        </p>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4 text-text">Place Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-text">Basic Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Place Name:</span>
              <span className="font-medium text-text">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Price per Day:</span>
              <span className="font-medium text-text">฿{formData.price}</span>
            </div>
            {formData.googleMapsLink && (
              <div className="pt-2">
                <span className="text-text/70">Google Maps:</span>
                <a 
                  href={formData.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-primary hover:text-secondary underline text-sm"
                >
                  View Location
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-text">Address</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Province:</span>
              <span className="font-medium text-text">{formData.address.province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">District:</span>
              <span className="font-medium text-text">{formData.address.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Sub-District:</span>
              <span className="font-medium text-text">{formData.address.subdistrict}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Postal Code:</span>
              <span className="font-medium text-text">{formData.address.postal_code}</span>
            </div>
            {formData.address.information && (
              <div className="flex justify-between">
                <span className="text-text/70">Additional Info:</span>
                <span className="font-medium text-text">{formData.address.information}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-card border border-border/40 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3 text-text">Place Images</h4>
        {imagePreview.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imagePreview.map((src, index) => (
              <div key={index} className="h-24 overflow-hidden rounded-md border border-border">
                <img
                  src={src}
                  alt={`Place Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text/70">No images uploaded</p>
        )}
      </div>
      <div className="bg-card border border-border/40 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3 text-text">Map Preview</h4>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-40 flex items-center justify-center">
          <p className="text-text/60">Map preview will be displayed here</p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderBasicInfo();
      case 2: return renderAddressInfo();
      case 3: return renderReview();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-text">Add New Place for Rent</h1>
      
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderCurrentStep()}
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </button>
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-5 w-5 mr-1" />
                  Create Place
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddPlace;