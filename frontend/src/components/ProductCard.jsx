/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getImage } from "../services/api/ImageApi";
import { useState, useEffect } from "react";
// Note: We're dynamically importing getShopById in the component to avoid issues with circular dependencies

function ProductCard({ products = [], size = "default" }) {
  const navigate = useNavigate();

  // Handle empty products array
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text/70">No products found.</p>
      </div>
    );
  }

  // Determine grid classes based on size
  const getGridClasses = () => {
    switch (size) {
      case "small":
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";
      case "medium":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5";
      case "default":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
    }
  };

  return (
    <div className={getGridClasses()}>
      {products.map((product) => (
        <ProductCardItem 
          key={product._id || product.id} 
          product={product} 
          size={size}
        />
      ))}
    </div>
  );
}

const ProductCardItem = ({ product, size = "default" }) => {
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState("");
  
  // Set animation variants and styles based on size
  const getCardStyles = () => {
    switch (size) {
      case "small":
        return {
          imageClasses: "aspect-square",
          titleClasses: "text-sm font-medium line-clamp-1",
          descriptionClasses: "text-xs line-clamp-1",
          priceClasses: "text-sm font-semibold",
          padding: "p-3",
          showDescription: false,
          showActions: false
        };
      case "medium":
        return {
          imageClasses: "aspect-[4/3]",
          titleClasses: "text-base font-medium line-clamp-1",
          descriptionClasses: "text-sm line-clamp-2",
          priceClasses: "text-base font-semibold",
          padding: "p-4",
          showDescription: true,
          showActions: true
        };
      case "default":
      default:
        return {
          imageClasses: "aspect-[4/3]",
          titleClasses: "font-medium text-lg mb-1 text-text line-clamp-1",
          descriptionClasses: "text-sm text-text/70 mb-3 line-clamp-2",
          priceClasses: "text-text font-semibold",
          padding: "p-4",
          showDescription: true,
          showActions: true
        };
    }
  };
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, transition: { duration: 0.3 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    hover: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  // Fetch product image if available
  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const fallbackImage = new URL("../assets/images/product-001.webp", import.meta.url).href;
        
        // If product has image URLs
        if (product.product_image_urls && product.product_image_urls.length > 0) {
          // Try to get image from API
          try {
            const imageUrl = await getImage(product.product_image_urls[0]);
            setProductImage(imageUrl || fallbackImage);
          } catch (error) {
            console.error("Error fetching product image:", error);
            setProductImage(fallbackImage);
          }
        } 
        // Handle direct image_url property
        else if (product.image_url) {
          setProductImage(product.image_url);
        }
        // Use fallback image if no product images
        else {
          setProductImage(fallbackImage);
        }
      } catch (error) {
        console.error("Error in image handling:", error);
        // Use fallback image on any error
        setProductImage(new URL("../assets/images/product-001.webp", import.meta.url).href);
      }
    };

    fetchProductImage();
  }, [product]);

  // Calculate the display price for products
  const getDisplayPrice = () => {
    // For products with variants
    if (product.variants?.length > 0) {
      const prices = product.variants.map(v => parseFloat(v.price));
      const minPrice = Math.min(...prices);
      return minPrice ? minPrice.toLocaleString() : "N/A";
    }
    
    // For products with base_price (from API)
    if (product.base_price) {
      return parseFloat(product.base_price).toLocaleString();
    }
    
    // Fallback to regular price field
    return product.price ? parseFloat(product.price).toLocaleString() : "N/A";
  };

  // Handle quick view
  const handleQuickView = (e) => {
    e.stopPropagation();
    navigateToProductDetail();
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart functionality would go here
    console.log("Adding to cart:", product);
  };

  // Get shop name from API
  const getShopNameForUrl = async () => {
    if (!product.shop_id) {
      console.log("No shop_id available for product:", product);
      return "shop"; // Default fallback
    }
    
    console.log("Fetching shop_id:", product.shop_id);
    
    try {
      // Import getShopById at the top of the file
      const { getShopById } = await import("../services/api/ShopApi");
      const response = await getShopById(product.shop_id);
      console.log("Shop API response:", response);
      
      if (response && response.shop_name) {
        // Format shop name for URL (convert to lowercase, replace spaces with hyphens)
        return encodeURIComponent(response.shop_name.replace(/\s+/g, '-').toLowerCase());
      } else {
        // Fallback to shop_id if no shop_name is found
        return product.shop_id;
      }
    } catch (error) {
      console.error("Error fetching shop details:", error);
      // Fallback to using product.shop_name or shop_id if API call fails
      if (product.shop_name) {
        return encodeURIComponent(product.shop_name.replace(/\s+/g, '-').toLowerCase());
      }
      return product.shop_id || "shop";
    }
  };

  // Navigate to product detail page with shop name from API
  const navigateToProductDetail = async () => {
    const productId = product._id || product.id;
    
    try {
      // Show loading state if needed
      const shopName = await getShopNameForUrl();
      
      // Navigate to /shop/:shop_name/:product_id
      // navigate(`/shop/${shopName}/${productId}`);
      navigate(`/shop/${product.shop_id}/${productId}`);
    } catch (error) {
      console.error("Error navigating to product:", error);
      // Fallback navigation using just the product ID if there's an error
      navigate(`/shop/product/${productId}`);
    }
  };

  // Handle product click
  const handleProductClick = () => {
    navigateToProductDetail();
  };

  const styles = getCardStyles();

  return (
    <motion.div
      className="bg-card rounded-xl overflow-hidden shadow-md border border-border/30 hover:shadow-xl transition-all relative group"
      onClick={handleProductClick}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Product image with overlay */}
      <div className={`relative overflow-hidden ${styles.imageClasses}`}>
        <img
          src={productImage || null}
          alt={product.product_name || "Product"}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        
        {/* Quick action buttons */}
        {styles.showActions && (
          <motion.div 
            className="absolute bottom-4 inset-x-0 flex justify-center space-x-2"
            initial="initial"
            variants={buttonVariants}
          >
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-md transition-colors"
              title="Quick view"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-primary hover:bg-secondary text-white shadow-md transition-colors"
              title="Add to cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Product info */}
      <div className={styles.padding}>
        <h3 className={styles.titleClasses}>{product.product_name || "Product"}</h3>
        
        {/* Shop name if available */}
        {product.shop_name && size !== "small" && (
          <p className="text-sm text-text/70 mb-2">{product.shop_name}</p>
        )}
        
        {/* Description if available */}
        {styles.showDescription && product.description && (
          <p className={styles.descriptionClasses}>{product.description}</p>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="text-text/90 text-sm mr-1">฿</span>
            <span className={styles.priceClasses}>{getDisplayPrice()}</span>
            
            {/* Show price range indicator if product has variants */}
            {product.variants?.length > 1 && (
              <span className="text-sm text-text/70 ml-1">+</span>
            )}
          </div>
          
          {size !== "small" && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-text/70">
              {product.category || "Uncategorized"}
            </span>
          )}
        </div>
      </div>
      
      {/* New badge - can be added based on created_at */}
      {new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs uppercase font-bold rounded-full px-2 py-1 z-10">
          New
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;