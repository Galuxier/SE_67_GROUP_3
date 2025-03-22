import { useState, useEffect } from "react";
import { XMarkIcon, PhotoIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function VariantModal({ 
  show, 
  onClose, 
  productOptions = [], 
  onSubmitVariant 
}) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [attribute, setAttribute] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setImageFile(null);
      setPreviewUrl(null);
      setPrice("");
      setStock("");
      setAttribute({});
      setErrors({});
    }
  }, [show]);

  // Set up initial attribute object based on product options
  useEffect(() => {
    if (show && productOptions.length > 0) {
      // Initialize attribute with empty values for each option
      const initialAttributes = {};
      productOptions.forEach(opt => {
        initialAttributes[opt.name] = "";
      });
      setAttribute(initialAttributes);
    }
  }, [show, productOptions]);

  // Handle image preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Clear any previous image error
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleChangeAttr = (optName, value) => {
    setAttribute(prev => ({ ...prev, [optName]: value }));
    // Clear any previous attribute error
    setErrors(prev => ({ ...prev, [optName]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check image
    if (!imageFile) {
      newErrors.image = "Please upload a variant image";
    }
    
    // Check price
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    
    // Check stock
    if (!stock || parseInt(stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity";
    }
    
    // Check attributes
    productOptions.forEach(opt => {
      if (!attribute[opt.name]) {
        newErrors[opt.name] = `Please enter a value for ${opt.name}`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const newVar = {
        image_url: imageFile,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        attribute,
      };
      
      onSubmitVariant(newVar);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting variant:", error);
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card dark:bg-background p-6 rounded-lg shadow-xl max-w-md w-full space-y-4 border border-border dark:border-border/50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-text dark:text-text">Add Variant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Variant Image */}
        <div>
          <label className="block font-medium text-text dark:text-text mb-1">Variant Image</label>
          <div className="flex flex-col items-center justify-center">
            {previewUrl ? (
              <div className="relative mb-2 group">
                <img
                  src={previewUrl}
                  alt="Variant Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-border dark:border-border/50"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                    }}
                    className="p-1 bg-white rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => document.getElementById('variant-image-upload').click()}
                className={`w-32 h-32 border-2 ${
                  errors.image ? 'border-red-500' : 'border-border dark:border-border/50'
                } border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors`}
              >
                <PhotoIcon className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-1 dark:text-text">Add Image</span>
              </div>
            )}
            <input
              id="variant-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.image}
              </p>
            )}
            <button
              type="button"
              onClick={() => document.getElementById('variant-image-upload').click()}
              className="mt-2 text-sm text-primary hover:text-secondary"
            >
              {previewUrl ? "Change Image" : "Upload Image"}
            </button>
          </div>
        </div>
        
        {/* Attributes */}
        {productOptions.map((opt, idx) => (
          <div key={idx}>
            <label className="block font-medium text-text dark:text-text mb-1">{opt.name}</label>
            
            {opt.values && opt.values.length > 0 ? (
              <select
                className={`w-full p-2 border ${
                  errors[opt.name] ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-border/50 focus:ring-primary'
                } rounded-lg bg-background dark:bg-card text-text dark:text-text focus:outline-none focus:ring-1`}
                value={attribute[opt.name] || ""}
                onChange={(e) => handleChangeAttr(opt.name, e.target.value)}
              >
                <option value="">Select {opt.name}</option>
                {opt.values.map((value, vidx) => (
                  <option key={vidx} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={`w-full p-2 border ${
                  errors[opt.name] ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-border/50 focus:ring-primary'
                } rounded-lg bg-background dark:bg-card text-text dark:text-text focus:outline-none focus:ring-1`}
                placeholder={`Enter ${opt.name}`}
                value={attribute[opt.name] || ""}
                onChange={(e) => handleChangeAttr(opt.name, e.target.value)}
              />
            )}
            
            {errors[opt.name] && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors[opt.name]}
              </p>
            )}
          </div>
        ))}
        
        {/* Price */}
        <div>
          <label className="block font-medium text-text dark:text-text mb-1">Price (฿)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`w-full p-2 border ${
              errors.price ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-border/50 focus:ring-primary'
            } rounded-lg bg-background dark:bg-card text-text dark:text-text focus:outline-none focus:ring-1`}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors(prev => ({ ...prev, price: "" }));
            }}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
              {errors.price}
            </p>
          )}
        </div>
        
        {/* Stock */}
        <div>
          <label className="block font-medium text-text dark:text-text mb-1">Stock</label>
          <input
            type="number"
            min="0"
            step="1"
            className={`w-full p-2 border ${
              errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-border/50 focus:ring-primary'
            } rounded-lg bg-background dark:bg-card text-text dark:text-text focus:outline-none focus:ring-1`}
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              setErrors(prev => ({ ...prev, stock: "" }));
            }}
          />
          {errors.stock && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
              {errors.stock}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border dark:border-border/50 rounded-lg text-text dark:text-text hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium disabled:bg-rose-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </div>
            ) : (
              "Add Variant"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}