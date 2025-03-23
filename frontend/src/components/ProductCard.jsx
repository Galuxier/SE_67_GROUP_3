/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getImage } from "../services/api/ImageApi";
import { useState, useEffect } from "react";

function ProductCard({ products = [] }) {
  const navigate = useNavigate();

  // Handle empty products array
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text/70">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCardItem key={product._id || product.id} product={product} />
      ))}
    </div>
  );
}

const ProductCardItem = ({ product }) => {
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState("");
  
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
        console.log(product.product_image_urls[0]);
        
        // If product has image URLs
        if (product.product_image_urls && product.product_image_urls.length > 0) {
          // Try to get image from API
          try {
            const imageUrl = await getImage(product.product_image_urls[0]);
            setProductImage(imageUrl);
          } catch (error) {
            console.error("Error fetching product image:", error);
            // Use fallback image
            setProductImage(new URL("../assets/images/product-001.webp", import.meta.url).href);
          }
        } else {
          // Use fallback image if no product images
          setProductImage(new URL("../assets/images/product-001.webp", import.meta.url).href);
        }
      } catch (error) {
        console.error("Error setting product image:", error);
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
    navigate(`/shop/product/${product._id || product.id}`);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart functionality would go here
    console.log("Adding to cart:", product);
  };

  // Handle product click
  const handleProductClick = () => {
    navigate(`/shop/product/${product._id || product.id}`);
  };

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
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={productImage}
          alt={product.product_name || "Product"}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        
        {/* Quick action buttons */}
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
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 text-text line-clamp-1">{product.product_name || "Product"}</h3>
        
        {/* Shop name if available */}
        {product.shop_name && (
          <p className="text-sm text-text/70 mb-2">{product.shop_name}</p>
        )}
        
        {/* Description if available */}
        {product.description && (
          <p className="text-sm text-text/70 mb-3 line-clamp-2">{product.description}</p>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="text-text/90 text-sm mr-1">฿</span>
            <span className="text-text font-semibold">{getDisplayPrice()}</span>
            
            {/* Show price range indicator if product has variants */}
            {product.variants?.length > 1 && (
              <span className="text-sm text-text/70 ml-1">+</span>
            )}
          </div>
          
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-text/70">
            {product.category || "Uncategorized"}
          </span>
        </div>
      </div>
      
      {/* New badge - can be added based on created_at */}
      {new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs uppercase font-bold rounded-full px-2 py-1 z-10">
          New
        </div>
      )}
      
      {/* Sale badge if needed */}
      {/* {product.onSale && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs uppercase font-bold rounded-full px-2 py-1 z-10">
          Sale
        </div>
      )} */}
    </motion.div>
  );
};

export default ProductCard;