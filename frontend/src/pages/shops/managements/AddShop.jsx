import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { 
  ArrowLeftIcon,
  PhotoIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import AddressForm from "../../../components/forms/AddressForm";
import ContactForm from "../../../components/forms/ContactForm";
import CropImageModal from "../../../components/shops/CropImageModal";
import { registerShop, checkShopNameExists } from "../../../services/api/ShopApi";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function AddShop() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const licenseInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // For cropper modal
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempFile, setTempFile] = useState(null);

  // Shop form data
  const [shopData, setShopData] = useState({
    shop_name: "",
    description: "",
    logo: null,
    license: null,
    contacts: {
      email: "",
      tel: "",
      line: "",
      facebook: ""
    },
    address: {}
  });

  // Image previews
  const [logoPreview, setLogoPreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  
  // Form validation
  const [errors, setErrors] = useState({});

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle contact form changes
  const handleContactChange = (contactData) => {
    setShopData(prev => ({
      ...prev,
      contacts: contactData
    }));
  };

  // Handle address form changes
  const handleAddressChange = (addressData) => {
    setShopData(prev => ({
      ...prev,
      address: addressData
    }));
  };

  // Handle logo file selection (to be cropped)
  const handleLogoSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setTempFile(file);
    setShowCropModal(true);
  };
  
  // Handle license file selection (no cropping)
  const handleLicenseSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setShopData(prev => ({
      ...prev,
      license: file
    }));
    setLicensePreview(URL.createObjectURL(file));
    
    // Clear any license error
    if (errors.license) {
      setErrors(prev => ({ ...prev, license: null }));
    }
  };

  // Handle cropped image from modal
  const handleCropDone = (croppedBlob) => {
    // Convert blob to File
    const croppedFile = new File([croppedBlob], "shop_logo.png", {
      type: "image/png"
    });
    
    setShopData(prev => ({
      ...prev,
      logo: croppedFile
    }));
    
    setLogoPreview(URL.createObjectURL(croppedBlob));
    setShowCropModal(false);
    
    // Clear any logo error
    if (errors.logo) {
      setErrors(prev => ({ ...prev, logo: null }));
    }
  };

  // Handle next step navigation
  const handleNextStep = async () => {
    // Validate current step
    const currentErrors = {};
    
    if (currentStep === 1) {
      if (!shopData.shop_name.trim()) {
        currentErrors.shop_name = "Shop name is required";
      }
      if (!shopData.description.trim()) {
        currentErrors.description = "Description is required";
      }
      if (!shopData.logo) {
        currentErrors.logo = "Shop logo is required";
      }
      
      // ถ้าไม่มี error และมีชื่อร้าน ให้เช็คชื่อซ้ำ
      if (Object.keys(currentErrors).length === 0 && shopData.shop_name.trim()) {
        try {
          setIsSubmitting(true); // ใช้ isSubmitting state ที่มีอยู่แล้ว
          const response = await checkShopNameExists(shopData.shop_name.trim());
          
          if (response.exists) {
            // ถ้าชื่อซ้ำ
            currentErrors.shop_name = "This shop name already exists. Please choose another name.";
            toast.error("Shop name already exists");
          }
        } catch (error) {
          console.error("Error checking shop name:", error);
          toast.error("Error checking shop name availability");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
    else if (currentStep === 2) {
      if (!shopData.license) {
        currentErrors.license = "Business license is required for verification";
      }
      if (!shopData.contacts.email) {
        currentErrors.email = "Email is required";
      }
      if (!shopData.contacts.tel) {
        currentErrors.tel = "Phone number is required";
      }
    }
    
    // If there are errors, show them and stop
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }
    
    // Proceed to next step
    setCurrentStep(prev => prev + 1);
  };

  // Handle previous step navigation
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for API call
      const formData = new FormData();
      
      // Add owner ID from current user
      formData.append("owner_id", user._id);
      
      // Add basic shop info
      formData.append("shop_name", shopData.shop_name);
      formData.append("description", shopData.description);
      
      // Add files
      if (shopData.logo) {
        formData.append("logo_url", shopData.logo);
      }
      
      if (shopData.license) {
        formData.append("license", shopData.license);
      }
      
      // Add contacts and address as JSON strings
      formData.append("contacts", JSON.stringify(shopData.contacts));
      formData.append("address", JSON.stringify(shopData.address));

      // Make API call to register shop
      const response = await registerShop(formData);
      console.log("Shop registered successfully:", response);
      
      // Update localStorage for demo purposes
      // In production, this would be handled by the API
      const savedShops = localStorage.getItem('userShops');
      const currentShops = savedShops ? JSON.parse(savedShops) : [];
      
      // Add the new shop with a temporary ID
      const newShop = {
        _id: `shop_${Date.now()}`,
        owner_id: user._id,
        shop_name: shopData.shop_name,
        description: shopData.description,
        logo_url: logoPreview, // In real app this would come from the API
        contacts: shopData.contacts,
        address: shopData.address
      };
      
      localStorage.setItem('userShops', JSON.stringify([...currentShops, newShop]));
      
      // Show success state
      setFormComplete(true);
      
      // After a delay, redirect to shop management
      setTimeout(() => {
        navigate('/shop/management');
      }, 2000);
      
    } catch (error) {
      console.error("Error registering shop:", error);
      toast.error("Failed to register shop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Clean up object URLs on unmount
  const cleanupPreviews = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (licensePreview) URL.revokeObjectURL(licensePreview);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    if (formComplete) {
      return (
        <div className="text-center py-10">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-text">Shop Created Successfully!</h2>
          <p className="text-text/70 mb-6">Your shop has been registered and is now ready for setup.</p>
          <p className="text-sm text-text/50 animate-pulse">Redirecting to shop management...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Basic Shop Information</h2>
            
            {/* Shop Logo */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">Shop Logo</label>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-32 h-32 rounded-full overflow-hidden ${
                    errors.logo 
                      ? 'border-2 border-red-500' 
                      : 'border border-border dark:border-border/50'
                  } cursor-pointer mb-2`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <PhotoIcon className="h-10 w-10 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Add Logo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleLogoSelect}
                />
                {errors.logo && (
                  <p className="text-sm text-red-500 mt-1">{errors.logo}</p>
                )}
                <p className="text-xs text-text/60 text-center max-w-xs mt-1">
                  Upload a square logo image for your shop. This will be displayed to customers.
                </p>
              </div>
            </div>
            
            {/* Shop Name */}
            <div>
              <label htmlFor="shop_name" className="block text-sm font-medium text-text mb-1">
                Shop Name
              </label>
              <input
                type="text"
                id="shop_name"
                name="shop_name"
                value={shopData.shop_name}
                onChange={handleInputChange}
                className={`block w-full rounded-md border ${
                  errors.shop_name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-border dark:border-border/50 focus:ring-primary'
                } px-4 py-2 bg-background dark:bg-card text-text`}
                placeholder="Enter your shop name"
              />
              {errors.shop_name && (
                <p className="text-sm text-red-500 mt-1">{errors.shop_name}</p>
              )}
            </div>
            
            {/* Shop Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
                Shop Description
              </label>
              <textarea
                id="description"
                name="description"
                value={shopData.description}
                onChange={handleInputChange}
                rows="4"
                className={`block w-full rounded-md border ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-border dark:border-border/50 focus:ring-primary'
                } px-4 py-2 bg-background dark:bg-card text-text resize-none`}
                placeholder="Describe your shop (products, specialties, etc.)"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Contact & License</h2>
            
            {/* Business License */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">Business License</label>
              <div className="flex items-center">
                {licensePreview ? (
                  <div className="relative w-32 h-32 border border-border dark:border-border/50 rounded-md overflow-hidden mr-4">
                    <img 
                      src={licensePreview} 
                      alt="License Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(licensePreview);
                        setLicensePreview(null);
                        setShopData(prev => ({ ...prev, license: null }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`w-32 h-32 border ${
                      errors.license 
                        ? 'border-red-500' 
                        : 'border-border dark:border-border/50'
                    } border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4`}
                    onClick={() => licenseInputRef.current?.click()}
                  >
                    <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload License</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-text">Business Verification</h3>
                  <p className="text-sm text-text/70 mb-2">
                    Please upload your business license or registration document for verification purposes.
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    ref={licenseInputRef}
                    className="hidden"
                    onChange={handleLicenseSelect}
                  />
                  <button
                    type="button"
                    onClick={() => licenseInputRef.current?.click()}
                    className="text-sm text-primary hover:text-secondary transition-colors"
                  >
                    Select File
                  </button>
                  
                  {errors.license && (
                    <p className="text-sm text-red-500 mt-1">{errors.license}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mt-6 dark:border-border/50">
              <h3 className="text-lg font-medium text-text mb-4">Contact Information</h3>
              <ContactForm 
                initialData={shopData.contacts}
                onChange={handleContactChange}
              />
              {(errors.email || errors.tel) && (
                <p className="text-sm text-red-500 mt-2">
                  Please provide required contact information.
                </p>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Shop Address</h2>
            <p className="text-text/70 mb-4">
              Please provide your shop's physical address. This will be displayed to customers.
            </p>
            
            <AddressForm
              initialData={shopData.address}
              onChange={handleAddressChange}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  // Progress bar for steps
  const renderStepIndicator = () => {
    const steps = ["Basic Info", "Contact & License", "Address"];
    const progress = Math.round((currentStep / steps.length) * 100);
    
    return (
      <div className="mb-6">
        {/* Progress bar */}
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step labels */}
        <div className="flex justify-between mt-2">
          {steps.map((label, index) => (
            <div 
              key={index}
              className={`text-xs font-medium ${
                index + 1 === currentStep
                  ? 'text-primary'
                  : index + 1 < currentStep
                    ? 'text-text/70'
                    : 'text-text/40'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-text">Register New Shop</h1>
        </div>
        
        {/* Main content card */}
        <div className="bg-card shadow-md rounded-xl border border-border/20 dark:border-border/10 overflow-hidden">
          {/* Progress indicator */}
          <div className="p-6 pb-0">
            {!formComplete && renderStepIndicator()}
          </div>
          
          {/* Form content */}
          <div className="p-6">
            {renderStepContent()}
          </div>
          
          {/* Action buttons */}
          {!formComplete && (
            <div className={`bg-card border-t border-border/20 dark:border-border/10 p-6 flex ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && currentStep === 1 ? (
                    <div className="flex items-center">
                      <ClipLoader size={16} color="#ffffff" />
                      <span className="ml-2">Checking...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Shop"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Cropper Modal */}
      {showCropModal && (
        <CropImageModal
          show={showCropModal}
          onClose={() => setShowCropModal(false)}
          file={tempFile}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  );
}