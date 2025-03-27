import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../../services/api/ProductApi";
import { getVariantsByProductId } from "../../services/api/VariantApi";
import { getImage } from "../../services/api/ImageApi";
import { getShopById } from "../../services/api/ShopApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, FreeMode } from 'swiper/modules';
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import {
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import ImageViewer from "../../components/ImageViewer";
import { addItemToCart } from "../../services/api/CartApi";

export default function ProductDetail() {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoggedIn } = useAuth();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [imageUrls, setImageUrls] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [variantImageMapping, setVariantImageMapping] = useState({});
  const [mainSwiperRef, setMainSwiperRef] = useState(null);
  
  // Fetch product and variant data
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get product details
        const productResponse = await getProductById(product_id);
        
        if (!productResponse) {
          throw new Error("Product not found");
        }
        
        const productData = productResponse.data || productResponse;
        setProduct(productData);
        
        // Fetch variants
        const variantsResponse = await getVariantsByProductId(product_id);
        const variantsList = variantsResponse.data || variantsResponse || [];
        console.log(variantsList);
        
        setVariants(variantsList);
        setSelectedAttrs({});
        
        // Fetch product images
        const variantImageMap = {};
        if (variantsList && variantsList.length > 0) {
          for (const variant of variantsList) {
            if (variant.variant_image_url) {
              try {
                const imgUrl = await getImage(variant.variant_image_url);
                if (imgUrl) {
                  variantImageMap[variant._id] = imgUrl;
                }
              } catch (error) {
                console.error(`Error fetching variant image for ${variant._id}:`, error);
              }
            }
          }
        }
        
        // Get product images
        let allImageUrls = [];
        
        // First add product images
        if (productData.product_image_urls && productData.product_image_urls.length > 0) {
          const productImages = await Promise.all(
            productData.product_image_urls.map(async (imageUrl) => {
              try {
                return await getImage(imageUrl);
              } catch (error) {
                console.error("Error fetching product image:", error);
                return null;
              }
            })
          );
          
          // Filter out null values from failed image fetches
          allImageUrls = productImages.filter(Boolean);
        }
        
        // Then add variant images (that aren't duplicates)
        const variantImages = Object.values(variantImageMap);
        for (const img of variantImages) {
          if (!allImageUrls.includes(img)) {
            allImageUrls.push(img);
          }
        }
        
        // If no images at all, use fallback
        if (allImageUrls.length === 0) {
          allImageUrls = [new URL("../../assets/images/product-placeholder.jpg", import.meta.url).href];
        }
        
        setImageUrls(allImageUrls);
        
        // Store variant image mapping for later use
        setVariantImageMapping(variantImageMap);
          
        // Fetch shop data if shop_id exists
        if (productData.shop_id) {
          try {
            const shopResponse = await getShopById(productData.shop_id);
            console.log(shopResponse);
            shopResponse.logo_url = await getImage(shopResponse.logo_url);
            setShopData(shopResponse.data || shopResponse);

          } catch (shopError) {
            console.error("Error fetching shop data:", shopError);
            // Non-critical error, continue without shop data
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [product_id]);

  // Helper function to get available attribute values - แก้ไขให้มีเพียงครั้งเดียว
  const getAttributeValues = (attrName) => {
    if (!variants || variants.length === 0) return [];
    
    // Get all unique values for this attribute
    const values = variants.map(variant => 
      variant.attributes?.[attrName] || null
    ).filter(Boolean);
    
    return [...new Set(values)];
  };
  
  // Get all attribute names from variants - แก้ไขให้มีเพียงครั้งเดียว
  const getAttributeNames = () => {
    if (!variants || variants.length === 0) return [];
    
    const allAttributes = variants.reduce((acc, variant) => {
      if (variant.attributes) {
        Object.keys(variant.attributes).forEach(key => acc.add(key));
      }
      return acc;
    }, new Set());
    
    return Array.from(allAttributes);
  };
  
  // Check if an attribute value is compatible with current selections - ย้ายไปอยู่ก่อนฟังก์ชันที่ใช้
  const isAttributeValueAvailable = (attrName, attrValue) => {
    // If no variants available, nothing is available
    if (!variants || variants.length === 0) return false;
    
    // Create a copy of current selections
    const testAttrs = { ...selectedAttrs };
    testAttrs[attrName] = attrValue;
    
    // Check if there's any variant matching this combination
    return variants.some(variant => {
      if (!variant.attributes) return false;
      
      // For each selected attribute, check if this variant matches
      return Object.entries(testAttrs).every(([key, val]) => 
        key === attrName ? variant.attributes[key] === attrValue : variant.attributes[key] === val
      );
    });
  };
  
  // Handle attribute selection
  const handleAttrChange = (attrName, value) => {
    // สร้าง newSelectedAttrs object
    let newSelectedAttrs = { ...selectedAttrs };
    
    // ถ้าค่าที่เลือกเหมือนกับค่าที่เลือกอยู่แล้ว = ต้องการยกเลิกการเลือก
    if (selectedAttrs[attrName] === value) {
      // ลบ attribute ออกจาก object
      delete newSelectedAttrs[attrName];
    } else {
      // กรณีปกติ - เลือกค่าใหม่
      newSelectedAttrs[attrName] = value;
    }
    
    // อัปเดต state
    setSelectedAttrs(newSelectedAttrs);
    
    // หา variant ที่ตรงกับตัวเลือกทั้งหมดที่เลือกไว้
    // หากไม่มีการเลือกตัวเลือกใดๆ หรือเลือกไม่ครบ จะไม่มี matching variant
    const matchingVariant = variants.find(variant => {
      if (!variant.attributes) return false;
      
      // ต้องมีตัวเลือกอย่างน้อย 1 อัน และตรวจสอบว่าทุกตัวเลือกที่เลือกตรงกับ variant
      return Object.keys(newSelectedAttrs).length > 0 && 
             Object.entries(newSelectedAttrs).every(([key, val]) => 
               variant.attributes[key] === val
             ) &&
             // ตรวจสอบว่าจำนวน attribute ใน newSelectedAttrs เท่ากับจำนวน attribute ใน variant
             Object.keys(newSelectedAttrs).length === Object.keys(variant.attributes).length;
    });
    
    // อัปเดต selectedVariant ถ้าพบที่ตรงกัน
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setQuantity(1);
      
      // ส่วนที่เกี่ยวกับการเลื่อนไปที่รูปภาพ variant (ถ้ามี)
      if (matchingVariant.variant_image_url && variantImageMapping && variantImageMapping[matchingVariant._id] && mainSwiperRef) {
        const variantImgUrl = variantImageMapping[matchingVariant._id];
        const variantImgIndex = imageUrls.findIndex(url => url === variantImgUrl);
        
        if (variantImgIndex !== -1) {
          mainSwiperRef.slideTo(variantImgIndex);
        }
      }
    } else {
      // ไม่พบ variant ที่ตรงกัน หรือมีการยกเลิกการเลือก
      setSelectedVariant(null);
    }
  };
  
  // Handle quantity changes
  // ฟังก์ชันจัดการ Quantity
    const handleDecreaseQuantity = () => {
      if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncreaseQuantity = () => {
      const maxStock = variants.length === 1 ? variants[0].stock : selectedVariant?.stock || 0;
      if (quantity < maxStock) setQuantity(quantity + 1);
    };

    const handleQuantityChange = (e) => {
      const value = parseInt(e.target.value, 10);
      const maxStock = variants.length === 1 ? variants[0].stock : selectedVariant?.stock || 0;
      
      if (!isNaN(value)) {
        if (value < 1) {
          setQuantity(1);
        } else if (value > maxStock) {
          setQuantity(maxStock);
        } else {
          setQuantity(value);
        }
      }
    };
  
  // Add to cart function
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast("Please login before buying");
      navigate("/login");
    }

    try {
      // กรณีสินค้ามีแค่ 1 variant (ถือว่าไม่มี variant ให้เลือก)
      if (variants.length === 1) {
        const defaultVariant = variants[0];
        
        if (defaultVariant.stock < quantity) {
          toast.error(`Sorry, only ${defaultVariant.stock} items available in stock`);
          return;
        }
  
        await addItemToCart({
          user_id: user._id,
          shop_id: product.shop_id,
          product_id: product._id,
          variant_id: defaultVariant._id,
          quantity: quantity
        });
  
        toast.success("Added to cart successfully!");
        return;
      }
  
      // กรณีสินค้ามีหลาย variants (ต้องเลือก variant)
      if (variants.length > 1 && !selectedVariant) {
        toast.error("Please select all product options");
        return;
      }
  
      if (selectedVariant.stock < quantity) {
        toast.error(`Sorry, only ${selectedVariant.stock} items available in stock`);
        return;
      }
  
      await addItemToCart({
        user_id: user._id,
        shop_id: product.shop_id,
        product_id: product._id,
        variant_id: selectedVariant._id,
        quantity: quantity
      });
  
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };
  
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast("Please login before buying");
      navigate("/login");
    }

    if (variants.length === 1) {
      const defaultVariant = variants[0];
      
      if (defaultVariant.stock < quantity) {
        toast.error(`Sorry, only ${defaultVariant.stock} items available in stock`);
        return;
      }
  
      const formData = {
        type: "product",
        product: {
          product_id: product._id,
          variant_id: defaultVariant._id,
          product_name: product.product_name,
          price: defaultVariant.price,
          quantity: quantity,
          attributes: {},
          shop_id: product.shop_id,
          shop_name: shopData?.shop_name || "Shop",
          image_url: variantImageMapping[defaultVariant._id] || imageUrls[0] || ""
        },
        subTotal: defaultVariant.price * quantity,
        shipping: 50,
        total: (defaultVariant.price * quantity) + 50
      };
  
      navigate("/shop/productPayment", { state: { formData } });
      return;
    }
  
    // กรณีสินค้ามีหลาย variants (ต้องเลือก variant)
    if (variants.length > 1 && !selectedVariant) {
      toast.error("Please select all product options");
      return;
    }
  
    if (selectedVariant.stock < quantity) {
      toast.error(`Sorry, only ${selectedVariant.stock} items available in stock`);
      return;
    }
  
    const formData = {
      type: "product",
      product: {
        product_id: product._id,
        variant_id: selectedVariant._id,
        product_name: product.product_name,
        price: selectedVariant.price,
        quantity: quantity,
        attributes: selectedVariant.attributes || {},
        shop_id: product.shop_id,
        shop_name: shopData?.shop_name || "Shop",
        image_url: variantImageMapping[selectedVariant._id] || imageUrls[0] || ""
      },
      subTotal: selectedVariant.price * quantity,
      shipping: 50,
      total: (selectedVariant.price * quantity) + 50
    };
  
    navigate("/shop/productPayment", { 
      state: { formData } 
    });
  };
  
  // Open image viewer
  const openImageViewer = (index) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };
  
  // Determine if all required options are selected
  const areAllOptionsSelected = () => {
    // ถ้าไม่มี variants หรือ variants ว่างเปล่า ให้ถือว่าเลือกครบแล้ว
    if (!variants || variants.length === 0) return true;
    
    // ถ้ามี variants ให้ตรวจสอบว่าต้องเลือกครบทุก attribute
    const allAttributeNames = getAttributeNames();
    return allAttributeNames.every(attr => selectedAttrs[attr]);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-8 flex justify-center">
        <div className="text-center p-8">
          <ClipLoader size={50} color="#E11D48" className="mb-4" />
          <p className="text-text">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pt-8">
        <div className="max-w-3xl mx-auto text-center p-8 bg-card rounded-lg shadow-md">
          <XMarkIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text mb-4">Product Not Found</h2>
          <p className="text-text/70 mb-6">{error}</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }
  
  // No product state
  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-8">
        <div className="max-w-3xl mx-auto text-center p-8 bg-card rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-text mb-4">Product Not Found</h2>
          <p className="text-text/70 mb-6">The requested product could not be found.</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 relative">
      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-text hover:text-primary transition-colors inline-flex items-center"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto bg-card p-4 md:p-8 shadow-md rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Product Images Section */}
          <div className="md:w-1/2">
            {/* Main Image Swiper */}
            <div className="w-full bg-background rounded-lg mb-3 overflow-hidden">
              {imageUrls.length > 0 ? (
                <Swiper
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Thumbs, Navigation]}
                  navigation={true}
                  onSwiper={setMainSwiperRef}
                  className="product-main-swiper"
                >
                  {imageUrls.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div 
                        className="flex items-center justify-center" 
                        style={{ height: '400px' }}
                        onClick={() => openImageViewer(index)}
                      >
                        <img
                          src={image}
                          alt={`${product.product_name || "Product"} ${index + 1}`}
                          className="max-w-full max-h-full object-contain cursor-pointer"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <p className="text-text/50">No product images available</p>
                </div>
              )}
            </div>
            
            {/* Thumbnails Swiper */}
            {imageUrls.length > 1 && (
              <div className="mt-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation]}
                  className="product-thumbs-swiper"
                >
                  {imageUrls.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-square cursor-pointer border border-border dark:border-border/50 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2 bg-card p-4 rounded-md">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-text">
              {product.product_name}
            </h1>
            
            {/* Price Display */}
            <div className="mb-4">
              {selectedVariant ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-text">
                    ฿{selectedVariant.price?.toLocaleString()}
                  </span>
                  {/* Show original price if there's a discount */}
                  {selectedVariant.original_price && selectedVariant.original_price > selectedVariant.price && (
                    <span className="ml-2 text-sm line-through text-text/50">
                      ฿{selectedVariant.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              ) : variants.length > 0 ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-text">
                    ฿{Math.min(...variants.map(v => v.price)).toLocaleString()}
                    {variants.length > 1 && <span className="text-text/70 text-sm"> - ฿{Math.max(...variants.map(v => v.price)).toLocaleString()}</span>}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-text">
                    ฿{(product.base_price || 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="mb-6 space-y-4">
                {getAttributeNames().map((attrName) => (
                  <div key={attrName}>
                    <label className="block font-medium capitalize text-text mb-2">
                      {attrName.replace('_', ' ')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getAttributeValues(attrName).map((value) => {
                        const isSelected = selectedAttrs[attrName] === value;
                        const isAvailable = isAttributeValueAvailable(attrName, value);
                        
                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => isAvailable && handleAttrChange(attrName, value)}
                            className={`px-3 py-2 rounded-lg border ${
                              isSelected 
                                ? 'border-primary bg-primary/10 text-primary font-medium' 
                                : isAvailable
                                  ? 'border-border hover:border-primary/50 text-text hover:bg-gray-50 dark:hover:bg-gray-700'
                                  : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                            } transition-colors`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-medium text-text mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-border rounded-l-lg bg-background text-text hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={variants.length === 1 ? variants[0].stock : selectedVariant?.stock || 1}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 h-10 border-y border-border text-center bg-background text-text focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= (variants.length === 1 ? variants[0].stock : selectedVariant?.stock || 0)}
                  className="w-10 h-10 flex items-center justify-center border border-border rounded-r-lg bg-background text-text hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                
                {(variants.length === 1 || selectedVariant) && (
                  <span className="ml-4 text-sm text-text/70">
                    {variants.length === 1 ? variants[0].stock : selectedVariant?.stock} available
                  </span>
                )}
              </div>
            </div>
            
            {/* Add to Cart and Buy Now Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* ปุ่ม Add to Cart และ Buy Now */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={variants.length > 1 ? !areAllOptionsSelected() : false}
              className="flex-1 py-3 px-4 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent flex items-center justify-center"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={variants.length > 1 ? !areAllOptionsSelected() : false}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-white hover:bg-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            </div>
            
            {/* Out of stock notification */}
            {selectedVariant && selectedVariant.stock <= 0 && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-900/30 dark:border-red-900 dark:text-red-400">
                <p className="flex items-center">
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  This item is currently out of stock.
                </p>
              </div>
            )}
            
            {/* Low stock warning */}
            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 dark:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400">
                <p className="flex items-center">
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Low stock! Only {selectedVariant.stock} items left.
                </p>
              </div>
            )}
            
            {/* Product Guarantees */}
            {/* <div className="border-t border-border/50 pt-4 space-y-2">
              <div className="flex items-center text-sm text-text/70">
                <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                <span>Authentic Products Guarantee</span>
              </div>
              <div className="flex items-center text-sm text-text/70">
                <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                <span>Secure Payments</span>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Shop Information */}
        {shopData && (
          <div className="mt-8 border-t border-border/30 pt-6">
            <Link
              to={`/shop/${shopData._id}`}
              className="block p-4 border border-border rounded-lg bg-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                {shopData.logo_url ? (
                  <img
                    src={shopData.logo_url}
                    alt="Shop logo"
                    className="w-12 h-12 object-cover rounded-full mr-4 border border-border/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 mr-4 flex items-center justify-center">
                    <BuildingStorefrontIcon className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="font-semibold text-text">{shopData.shop_name || "Shop"}</h3>
                  <p className="text-sm text-text/70">{shopData.description || "Visit shop for more products"}</p>
                </div>
                <span className="text-sm text-primary">View Shop →</span>
              </div>
            </Link>
          </div>
        )}
        
        {/* Product Description */}
        <div className="mt-8 border-t border-border/30 pt-6">
          <h2 className="text-xl font-semibold text-text mb-4">Product Description</h2>
          <div className="prose prose-sm max-w-none text-text dark:prose-invert overflow-hidden">
            {/* Check if description is HTML */}
            {product.description && product.description.trim().startsWith('<') ? (
              <div 
                className="break-words whitespace-pre-wrap" 
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            ) : (
              <p className="break-words whitespace-pre-wrap">
                {product.description || "No description available"}
              </p>
            )}
          </div>
          {user && user.role && user.role.includes("shop_owner") ? (
          <motion.div 
            className="fixed bottom-6 right-6 z-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          >
            <Link
              to="/shop/add-product"
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Add New Product</span>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="fixed bottom-6 right-6 z-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          >
            <Link
              to="/shop/cart"
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>View Cart</span>
            </Link>
          </motion.div>
        )}
        </div>
      </div>
      
      {/* Image Viewer */}
      <ImageViewer 
        images={imageUrls}
        currentIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}