/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getImage } from "../services/api/ImageApi";
import { getVariantsByProductId } from "../services/api/VariantApi";
import { useState, useEffect } from "react";

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
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"; // ปรับเป็น 4 คอลัมน์ที่ lg
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
  const [variants, setVariants] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

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

  // Fetch product image
  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const fallbackImage = new URL("../assets/images/product-001.webp", import.meta.url).href;
        
        if (product.product_image_urls && product.product_image_urls.length > 0) {
          try {
            const imageUrl = await getImage(product.product_image_urls[0]);
            setProductImage(imageUrl || fallbackImage);
          } catch (error) {
            console.error("Error fetching product image:", error);
            setProductImage(fallbackImage);
          }
        } else if (product.image_url) {
          setProductImage(product.image_url);
        } else {
          setProductImage(fallbackImage);
        }
      } catch (error) {
        console.error("Error in image handling:", error);
        setProductImage(new URL("../assets/images/product-001.webp", import.meta.url).href);
      }
    };

    fetchProductImage();
  }, [product]);

  // Fetch variants
  useEffect(() => {
    const fetchVariants = async () => {
      if (!product._id && !product.id) return;
      
      setIsLoadingVariants(true);
      try {
        const productId = product._id || product.id;
        const response = await getVariantsByProductId(productId);
        setVariants(response.data || []);
      } catch (error) {
        console.error("Error fetching variants:", error);
        setVariants([]);
      } finally {
        setIsLoadingVariants(false);
      }
    };

    fetchVariants();
  }, [product]);

  // Calculate the display price for products
  const getDisplayPrice = () => {
    if (variants.length > 0) {
      const prices = variants.map(v => parseFloat(v.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return minPrice.toLocaleString();
      }
      return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
    }
    
    if ('base_price' in product || product.base_price !== undefined) {
      const basePrice = parseFloat(product.base_price);
      return isNaN(basePrice) ? "N/A" : basePrice.toLocaleString();
    }
    
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
    console.log("Adding to cart:", product);
  };

  // Get shop name from API
  const getShopNameForUrl = async () => {
    if (!product.shop_id) return "shop";
    
    try {
      const { getShopById } = await import("../services/api/ShopApi");
      const response = await getShopById(product.shop_id);
      return response?.shop_name 
        ? encodeURIComponent(response.shop_name.replace(/\s+/g, '-').toLowerCase())
        : product.shop_id;
    } catch (error) {
      console.error("Error fetching shop details:", error);
      return product.shop_name 
        ? encodeURIComponent(product.shop_name.replace(/\s+/g, '-').toLowerCase())
        : product.shop_id || "shop";
    }
  };

  // Navigate to product detail page
  const navigateToProductDetail = async () => {
    const productId = product._id || product.id;
    try {
      const shopName = await getShopNameForUrl();
      navigate(`/shop/${shopName}/${productId}`);
    } catch (error) {
      console.error("Error navigating to product:", error);
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
            <span className={styles.priceClasses}>
              {isLoadingVariants ? "Loading..." : getDisplayPrice()}
            </span>
            {variants.length > 1 && !isLoadingVariants && (
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
      
      {/* New badge */}
      {new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs uppercase font-bold rounded-full px-2 py-1 z-10">
          New
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;