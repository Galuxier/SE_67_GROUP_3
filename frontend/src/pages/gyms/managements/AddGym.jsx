import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AddressForm from "../../../components/forms/AddressForm";
import ContactForm from "../../../components/forms/ContactForm";
import { CreateGym, checkGymNameExists } from "../../../services/api/GymApi";
import { toast } from "react-toastify";

const AddGym = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const siteplanInputRef = useRef(null);
  
  const [gymData, setGymData] = useState({
    gym_name: "",
    description: "",
    price: "",
    gym_image_url: [],
    gym_siteplan_url: null,
    contact: {
      email: "",
      tel: "",
      line: "",
      facebook: ""
    },
    address: {
      province: "",
      district: "",
      subdistrict: "",
      postal_code: "",
      information: ""
    }
  });

  const [filePreviews, setFilePreviews] = useState([]);
  const [siteplanPreview, setSiteplanPreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleImageUpload = (e, fieldName) => {
    const files = Array.from(e.target.files);

    if (fieldName === "gym_image_url") {
      if (files.length + gymData.gym_image_url.length > 10) {
        alert("You can upload a maximum of 10 images.");
        return;
      }
      
      setGymData({
        ...gymData,
        gym_image_url: [...gymData.gym_image_url, ...files]
      });
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setFilePreviews([...filePreviews, ...newPreviews]);
      setFileSelected(true);
    } else if (fieldName === "gym_siteplan_url") {
      setGymData({
        ...gymData,
        gym_siteplan_url: files[0],
      });
      
      if (files[0]) {
        const previewUrl = URL.createObjectURL(files[0]);
        setSiteplanPreview(previewUrl);
      }
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...filePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
    
    const newFiles = [...gymData.gym_image_url];
    newFiles.splice(index, 1);
    setGymData({
      ...gymData,
      gym_image_url: newFiles
    });
    
    if (newFiles.length === 0) {
      setFileSelected(false);
    }
  };
  
  const handleRemoveSiteplan = () => {
    if (siteplanPreview) {
      URL.revokeObjectURL(siteplanPreview);
      setSiteplanPreview(null);
    }
    
    setGymData({
      ...gymData,
      gym_siteplan_url: null
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!gymData.gym_name || !gymData.description || gymData.gym_image_url.length === 0) {
      alert("Please fill in all required fields and upload at least one image.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Check if gym name already exists
      const name = await checkGymNameExists(gymData.gym_name);
      if (name.exists) {
        toast.error("Gym name already exists. Please choose a different name.");
        setIsSubmitting(false);
        return;
      }

      // If name is unique, proceed with form submission
      const formData = new FormData();
      
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        formData.append('owner_id', user._id);
      } else {
        throw new Error("User not logged in or user ID not found");
      }
      
      formData.append('gym_name', gymData.gym_name);
      formData.append('description', gymData.description);
      
      formData.append('contact', JSON.stringify(gymData.contact));
      formData.append('address', JSON.stringify(gymData.address));
      
      gymData.gym_image_url.forEach((file) => {
        formData.append('gym_image_urls', file);
      });
      
      console.log("Preparing to submit form data:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await CreateGym(formData);
      console.log("Gym created successfully:", response);
      toast.success("Gym created successfully!");
      navigate("/gym/management/gymlist");
    } catch (error) {
      console.error("Error creating gym:", error);
      toast.error("Failed to create gym. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background pt-10 pb-10">
      <div className="w-full max-w-2xl p-8 shadow-lg bg-card rounded-lg overflow-y-auto border border-border/30">
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
          <div className="w-9"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          <div>
            <label className="block text-sm font-medium mb-2 text-text">Contact Information</label>
            <div className="bg-background/50 p-4 rounded-lg border border-border/50">
              <ContactForm 
                initialData={gymData.contact}
                onChange={handleContactChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text">Gym Photos</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-background/50">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleImageUpload(e, "gym_image_url")}
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
                    Click to upload gym photos
                  </p>
                  <p className="mt-1 text-xs text-text/40">
                    PNG, JPG up to 10 files
                  </p>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text">Location</label>
            <div className="bg-background/50 p-4 rounded-lg border border-border/50">
              <AddressForm onChange={handleAddressChange} />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Add Gym"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGym;