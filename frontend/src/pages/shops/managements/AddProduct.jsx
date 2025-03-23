import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  XMarkIcon,
  PhotoIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import VariantModal from "../../../components/shops/VariantModal";
import OptionEditor from "../../../components/shops/OptionEditor";
import { useOutletContext } from "react-router-dom";
import { createProduct } from "../../../services/api/ShopApi";

export default function AddProduct() {
  const navigate = useNavigate();
  const { shopData } = useOutletContext() || {};
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product basic information
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    baseImage: null,
    hasOptions: false,
    price: "",
    stock: "",
    options: [],
    variants: [],
  });

  // For handling options (color, size, etc.)
  const [newOption, setNewOption] = useState("");
  const [newOptionValues, setNewOptionValues] = useState([]);
  const [newOptionValue, setNewOptionValue] = useState("");

  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Set touched field when focusing on an input
  const handleFocus = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Handle input changes for basic product info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle file input for product images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
  
    // Preview images
    const newImages = files.map(file => ({
      file,  // Store the actual File object
      preview: URL.createObjectURL(file)
    }));
  
    setCurrentImages([...currentImages, ...newImages]);
  
    // Set base image if it's the first image
    if (!product.baseImage && newImages.length > 0) {
      setProduct(prev => ({ ...prev, baseImage: newImages[0].preview }));
    }
  };

  // Remove an image from the preview
  const removeImage = (index) => {
    const newImages = [...currentImages];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newImages[index].preview);
    
    newImages.splice(index, 1);
    setCurrentImages(newImages);

    // Update base image if needed
    if (product.baseImage === currentImages[index].preview) {
      setProduct(prev => ({
        ...prev,
        baseImage: newImages.length > 0 ? newImages[0].preview : null
      }));
    }
  };

  // Set an image as the base image
  const setAsBaseImage = (index) => {
    setProduct(prev => ({
      ...prev,
      baseImage: currentImages[index].preview
    }));
  };

  // Add a new product option (like "Color" or "Size")
  const addOption = () => {
    if (!newOption.trim()) {
      toast.error("Please enter an option name");
      return;
    }

    if (product.options.some(opt => opt.name.toLowerCase() === newOption.toLowerCase())) {
      toast.error("This option already exists");
      return;
    }

    if (newOptionValues.length === 0) {
      toast.error("Please add at least one option value");
      return;
    }

    const newProductOptions = [
      ...product.options,
      {
        name: newOption,
        isMain: product.options.length === 0, // First option is main by default
        values: newOptionValues
      }
    ];

    setProduct(prev => ({
      ...prev,
      options: newProductOptions
    }));

    // Reset option inputs
    setNewOption("");
    setNewOptionValues([]);
    setNewOptionValue("");
  };

  // Add a value to the current option (like "Red" for "Color")
  const addOptionValue = () => {
    if (!newOptionValue.trim()) return;
    
    if (newOptionValues.includes(newOptionValue)) {
      toast.error("This value already exists");
      return;
    }
    
    setNewOptionValues([...newOptionValues, newOptionValue]);
    setNewOptionValue("");
  };

  // Remove an option value
  const removeOptionValue = (value) => {
    setNewOptionValues(newOptionValues.filter(v => v !== value));
  };

  // Remove an entire option
  const removeOption = (index) => {
    const newOptions = [...product.options];
    newOptions.splice(index, 1);
    
    // If we removed the main option, set the first remaining option as main
    if (newOptions.length > 0 && product.options[index].isMain) {
      newOptions[0].isMain = true;
    }
    
    setProduct(prev => ({ ...prev, options: newOptions }));
  };

  // Set an option as the main option
  const setAsMainOption = (index) => {
    setProduct(prev => {
      const updatedOptions = prev.options.map((opt, i) => ({
        ...opt,
        isMain: i === index
      }));
      return { ...prev, options: updatedOptions };
    });
  };

  // Add a new variant from the variant modal
  const handleAddVariant = (newVariant) => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
    setShowVariantModal(false);
  };

  // Remove a variant
  const removeVariant = (index) => {
    const newVariants = [...product.variants];
    newVariants.splice(index, 1);
    setProduct(prev => ({ ...prev, variants: newVariants }));
  };

  const handleUpdateOption = (index, updatedOption) => {
    setProduct(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = updatedOption;
      return { ...prev, options: newOptions };
    });
  };

  // Proceed to the next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate basic info
      const newErrors = {};
      if (!product.name) newErrors.name = "Product name is required";
      if (!product.category) newErrors.category = "Category is required";
      if (currentImages.length === 0) newErrors.images = "At least one image is required";
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (currentStep === 2) {
      // Validate options/variants
      if (product.hasOptions) {
        if (product.options.length === 0) {
          setErrors({ options: "Please add at least one option" });
          return;
        }
        
        if (product.variants.length === 0) {
          setErrors({ variants: "Please add at least one variant" });
          return;
        }
      } else {
        if (!product.price) {
          setErrors({ price: "Please enter a price" });
          return;
        }
        if (!product.stock) {
          setErrors({ stock: "Please enter stock quantity" });
          return;
        }
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Go back to the previous step
  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for API call
      const formData = new FormData();
      
      // Add basic product info
      formData.append("shop_id", shopData._id);
      formData.append("product_name", product.name);
      formData.append("category", product.category);
      formData.append("description", product.description);
      
      // Add product images
      if (currentImages && currentImages.length > 0) {
        currentImages.forEach(image => {
          formData.append("product_image_urls", image.file);
        });
      }
      
      if (product.hasOptions && product.variants.length > 0) {
        // Prepare variant data
        const variantsWithoutImages = product.variants.map(variant => {
          // Create a copy without the image file
          return {
            price: variant.price,
            stock: variant.stock,
            attribute: variant.attribute || {}
          };
        });
        
        // Add variant count
        formData.append("variantCount", product.variants.length.toString());
        
        // Add variant data as a JSON string
        formData.append("variantData", JSON.stringify(variantsWithoutImages));
        
        // Add variant images separately
        product.variants.forEach((variant, index) => {
          if (variant.image_url) {
            formData.append(`variants[${index}][variant_image_url]`, variant.image_url);
          }
        });
      } else {
        // For products without variants, create a single variant
        const singleVariant = [{
          price: product.price,
          stock: product.stock,
          attribute: {}
        }];
        
        formData.append("variantCount", "1");
        formData.append("variantData", JSON.stringify(singleVariant));
        
        // If there's at least one image, use the first one as variant image
        if (currentImages && currentImages.length > 0) {
          formData.append("variants[0][variant_image_url]", currentImages[0].file);
        }
      }
      
      // Send the form data to the API
      const response = await createProduct(formData);
      console.log("Product created successfully:", response);
      
      // Navigate to product view or shop dashboard
      navigate(`/shop/management/${shopData._id}`);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup function for image URLs
  useEffect(() => {
    return () => {
      currentImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  // Render the form based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderVariantsStep();
      case 3:
        return renderSummaryStep();
      default:
        return renderBasicInfoStep();
    }
  };

  // Render the basic info step (Step 1)
  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-lg text-text font-medium mb-2 dark:text-text">Product Name</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          onFocus={() => handleFocus('name')}
          placeholder="Enter product name"
          className={`w-full text-text border ${
            errors.name ? 'border-red-500' : 'border-border'
          } rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
  
      <div>
        <label className="block text-lg font-medium mb-2 dark:text-text">Category</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleInputChange}
          onFocus={() => handleFocus('category')}
          placeholder="Enter product category"
          className={`w-full border ${
            errors.category ? 'border-red-500' : 'border-border'
          } rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50`}
        />
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>
  
      <div>
        <label className="block text-lg font-medium mb-2 dark:text-text">Description</label>
        <textarea
          rows="4"
          name="description"
          value={product.description}
          onChange={handleInputChange}
          onFocus={() => handleFocus('description')}
          placeholder="Enter product description"
          className="w-full border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50"
        />
      </div>
  
      <div>
        <label className="block text-lg font-medium mb-2 dark:text-text">Product Images</label>
        
        <div className="flex flex-wrap gap-4 mb-3">
          {currentImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative group w-24 h-24 border rounded-lg overflow-hidden ${
                product.baseImage === image.preview ? 'border-primary border-2' : 'border-border'
              }`}
            >
              <img 
                src={image.preview} 
                alt={`Product preview ${index}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button 
                  type="button"
                  onClick={() => setAsBaseImage(index)}
                  className="p-1 bg-white rounded-full hover:bg-gray-100"
                  title="Set as main image"
                >
                  <CheckIcon className="w-4 h-4 text-green-600" />
                </button>
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-white rounded-full hover:bg-gray-100"
                  title="Remove image"
                >
                  <XMarkIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
              {product.baseImage === image.preview && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center py-0.5">
                  Main
                </div>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors dark:border-border/50"
          >
            <PhotoIcon className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500 mt-1 dark:text-text">Add Image</span>
          </button>
          
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        
        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
        <p className="text-sm text-gray-500 dark:text-text">First image will be used as the main product image. Click on an image to set it as main.</p>
      </div>
    </div>
  );

  // Render the variants step (Step 2)
  // Updated renderVariantsStep function with dark mode support
  const renderVariantsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center text-lg font-medium mb-2 text-text dark:text-text">
          <span>Does this product have variants?</span>
          <div className="ml-4 relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              value="" 
              className="sr-only peer"
              checked={product.hasOptions}
              onChange={() => setProduct(prev => ({ ...prev, hasOptions: !prev.hasOptions }))}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </div>
        </label>
      </div>

      {product.hasOptions ? (
        <>
          {/* Options Section */}
          <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
            <h3 className="text-lg font-medium mb-3 text-text dark:text-text">Product Options</h3>
            <p className="text-sm text-gray-500 mb-4 dark:text-text/70">
              Add options like color, size, etc. that customers can choose from.
            </p>
            
            {/* Add new option form */}
            <div className="flex flex-col space-y-3 mb-4 pb-4 border-b border-border dark:border-border/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Option name (e.g. Size, Color)"
                  className="flex-grow border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50"
                />
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addOptionValue()}
                  placeholder="Option value (e.g. Red, XL)"
                  className="flex-grow border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50"
                />
                <button
                  type="button"
                  onClick={addOptionValue}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors dark:bg-primary dark:hover:bg-secondary"
                >
                  Add Value
                </button>
              </div>
              
              {/* Current option values */}
              {newOptionValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newOptionValues.map((value, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 dark:bg-gray-700">
                      <span className="text-sm text-text dark:text-text">{value}</span>
                      <button
                        type="button"
                        onClick={() => removeOptionValue(value)}
                        className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={addOption}
                disabled={!newOption || newOptionValues.length === 0}
                className="self-start mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-primary dark:hover:bg-secondary dark:disabled:bg-gray-600"
              >
                Add Option
              </button>
            </div>
            
            {/* Existing options */}
            {product.options.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-text dark:text-text">Added Options:</h4>
                {product.options.map((option, index) => (
                  <OptionEditor
                    key={index}
                    option={option}
                    index={index}
                    onUpdateOption={handleUpdateOption}
                    onRemoveOption={removeOption}
                    onSetMain={setAsMainOption}
                  />
                ))}
              </div>
            )}
            
            {errors.options && <p className="mt-2 text-sm text-red-500">{errors.options}</p>}
          </div>
          
          {/* Variants Section */}
          <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-text dark:text-text">Product Variants</h3>
              <button
                type="button"
                onClick={() => setShowVariantModal(true)}
                disabled={product.options.length === 0}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center dark:bg-primary dark:hover:bg-secondary dark:disabled:bg-gray-600"
              >
                <PlusCircleIcon className="w-5 h-5 mr-1" />
                Add Variant
              </button>
            </div>
            
            {product.options.length === 0 && (
              <div className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700">
                <InformationCircleIcon className="flex-shrink-0 w-5 h-5 mr-3" />
                <span>Add at least one option before creating variants.</span>
              </div>
            )}
            
            {/* Variants list */}
            {product.variants.length > 0 ? (
              <div className="space-y-4">
                {product.variants.map((variant, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg flex items-center bg-card dark:bg-background dark:border-border/50">
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={variant.image_url instanceof File ? URL.createObjectURL(variant.image_url) : variant.image_url} 
                        alt="Variant" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Object.entries(variant.attribute).map(([key, value]) => (
                          <span key={key} className="px-2 py-0.5 bg-gray-100 rounded text-xs dark:bg-gray-700 dark:text-text">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-text dark:text-text">
                          <span className="font-medium">Price:</span> ฿{variant.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-text dark:text-text">
                          <span className="font-medium">Stock:</span> {variant.stock}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="ml-4 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-text/70">
                No variants added yet
              </div>
            )}
            
            {errors.variants && <p className="mt-2 text-sm text-red-500">{errors.variants}</p>}
          </div>
        </>
      ) : (
        // Simple product (no variants)
        <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
          <h3 className="text-lg font-medium mb-4 text-text dark:text-text">Product Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text dark:text-text">Price (฿)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className={`w-full border ${
                  errors.price ? 'border-red-500' : 'border-border'
                } rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-text dark:text-text">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                placeholder="Enter stock quantity"
                className={`w-full border ${
                  errors.stock ? 'border-red-500' : 'border-border'
                } rounded-lg py-2 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background dark:bg-card dark:text-text dark:border-border/50`}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render the summary step (Step 3)
  const renderSummaryStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-text dark:text-text">Product Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2 text-text dark:text-text">Basic Information</h4>
          <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
            <div className="space-y-2">
              <div className="text-text dark:text-text">
                <span className="font-medium">Name:</span> {product.name}
              </div>
              <div className="text-text dark:text-text">
                <span className="font-medium">Category:</span> {product.category}
              </div>
              <div className="text-text dark:text-text">
                <span className="font-medium">Description:</span> 
                <p className="text-sm text-gray-600 mt-1 dark:text-text">
                  {product.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2 text-text dark:text-text">Images</h4>
          <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
            <div className="flex flex-wrap gap-2">
              {currentImages.map((image, index) => (
                <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                  <img 
                    src={image.preview} 
                    alt={`Product ${index}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {product.hasOptions ? (
        <div>
          <h4 className="font-medium mb-2 text-text dark:text-text">Variants ({product.variants.length})</h4>
          <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
            <div className="space-y-3">
              {product.variants.map((variant, index) => (
                <div key={index} className="p-3 border border-border rounded-lg flex items-center bg-card dark:bg-background dark:border-border/50">
                  <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={variant.image_url instanceof File ? URL.createObjectURL(variant.image_url) : variant.image_url} 
                      alt="Variant" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-1">
                      {Object.entries(variant.attribute).map(([key, value]) => (
                        <span key={key} className="px-2 py-0.5 bg-gray-100 rounded text-xs dark:bg-gray-700 dark:text-text">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                    <div className="flex text-sm text-text dark:text-text">
                      <span className="font-medium mr-4">Price: ฿{variant.price.toLocaleString()}</span>
                      <span className="font-medium">Stock: {variant.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="font-medium mb-2 text-text dark:text-text">Pricing</h4>
          <div className="p-4 border border-border rounded-lg bg-card dark:bg-background dark:border-border/50">
            <div className="flex justify-between text-text dark:text-text">
              <span className="font-medium">Price:</span> ฿{parseFloat(product.price).toLocaleString() || "0"}
              <span className="font-medium">Stock:</span> {product.stock || "0"}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Progress bar for steps
  const renderProgressBar = () => {
    const steps = ["Basic Info", "Variants", "Summary"];
    
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1 
                  ? 'bg-primary text-white' 
                  : currentStep === index + 1 
                    ? 'bg-primary/20 border-2 border-primary text-primary font-medium' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`mt-2 text-xs ${
                currentStep >= index + 1 ? 'text-primary font-medium' : 'text-gray-600'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-2">
          <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
          <div 
            className="absolute top-0 h-1 bg-primary transition-all duration-300" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-text hover:bg-gray-100 dark:hover:bg-gray-700 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-text">Add New Product</h1>
        </div>
        
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Main Form */}
        <div className="bg-card border border-border/20 rounded-xl shadow-lg p-6">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Product...
                  </>
                ) : (
                  <>
                    Create Product
                    <CheckIcon className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Variant Modal */}
      <VariantModal
        show={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        productOptions={product.options}
        onSubmitVariant={handleAddVariant}
      />
    </div>
  );
}