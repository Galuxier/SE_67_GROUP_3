import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import AddressForm from "../../../components/forms/AddressForm";

// Placeholder for API function - will need to be implemented
// import { createPlace } from "../../../services/api/PlaceApi";

const AddPlace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    // Convert price to number
    if (name === "price") {
      updatedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleAddressChange = (addressData) => {
    setFormData({
      ...formData,
      address: addressData
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setImages([...images, ...files]);
      
      // Generate previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview([...imagePreview, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreview];
    
    // Revoke the object URL to avoid memory leaks
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
      
      // Create a FormData object to handle file uploads
      const placeFormData = new FormData();
      
      // Add place data
      placeFormData.append("owner_id", user._id);
      placeFormData.append("name", formData.name);
      placeFormData.append("price", formData.price);
      placeFormData.append("googleMapsLink", formData.googleMapsLink);
      
      // Add address data
      placeFormData.append("address", JSON.stringify(formData.address));
      
      // Add images
      images.forEach((image) => {
        placeFormData.append("images", image);
      });
      
      // Send data to API
      // const response = await createPlace(placeFormData);
      
      // Simulated response for now
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-text">Add New Place for Rent</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Place Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
            Place Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-background text-text"
            required
          />
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text mb-1">
            Price per Day (THB) <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-background text-text"
            required
          />
        </div>
        
        {/* Google Maps Link */}
        <div>
          <label htmlFor="googleMapsLink" className="block text-sm font-medium text-text mb-1">
            Google Maps Link <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="url"
            id="googleMapsLink"
            name="googleMapsLink"
            value={formData.googleMapsLink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-background text-text"
            placeholder="e.g. https://maps.google.com/?q=..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Paste a link to the location on Google Maps to help renters find your place easily
          </p>
        </div>
        
        {/* Address Form */}
        <div className="border border-border rounded-md p-4">
          <h2 className="text-lg font-medium mb-4 text-text">Address Information</h2>
          <AddressForm 
            address={formData.address} 
            onChange={handleAddressChange} 
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
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
          
          {/* Image Previews - Fixed to ensure images stay in frame */}
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
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/place/management")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Cancel
          </button>
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
                Processing...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> 
                Create Place
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlace;