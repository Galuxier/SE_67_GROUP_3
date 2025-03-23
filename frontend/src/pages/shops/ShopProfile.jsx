import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShopById } from "../../services/api/ShopApi"; 
import { getImage } from "../../services/api/ImageApi";
import { getProductsByShop } from "../../services/api/ProductApi";
import ProductCard from "../../components/ProductCard";
import EditShopModal from "../../components/shops/EditShopModal";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { BuildingStorefrontIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function ShopProfile() {
  const { id } = useParams(); 
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [shopLogoUrl, setShopLogoUrl] = useState(""); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [shopProducts, setShopProducts] = useState([]);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch shop data
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoadingShop(true);
        const response = await getShopById(id);
        setShop(response);
        
        // Fetch shop logo if available
        if (response.logo) {
          try {
            const logoUrl = await getImage(response.logo);
            setShopLogoUrl(logoUrl);
          } catch (imageError) {
            console.error("Error fetching shop logo:", imageError);
          }
        }
      } catch (error) {
        console.error("Error fetching shop:", error);
        toast.error("Failed to load shop information");
      } finally {
        setIsLoadingShop(false);
      }
    };
    
    if (id) {
      fetchShopData();
    }
  }, [id]);
  
  // Fetch shop products
  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const products = await getProductsByShop(id);
        setShopProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error("Error fetching shop products:", error);
        // Use dummy data as fallback
        setShopProducts([
          {
            id: 1,
            product_name: "Muay Thai Boxing Gloves",
            description: "Professional grade boxing gloves for training and competition",
            image_url: new URL("../../assets/images/Glove_black.jpg", import.meta.url).href,
            price: 1200,
            category: "Gloves",
            shop_name: shop?.shop_name || "Shop",
          },
          {
            id: 2,
            product_name: "Hand Wraps - 180cm",
            description: "Premium quality hand wraps for maximum wrist support",
            image_url: new URL("../../assets/images/product-003.webp", import.meta.url).href,
            price: 350,
            category: "Accessories",
            shop_name: shop?.shop_name || "Shop",
          }
        ]);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    if (shop) {
      fetchShopProducts();
    }
  }, [shop, id]);

  const handleOpenModal = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);
  
  const handleSaveShop = (newShopData) => {
    setShop((prev) => ({ ...prev, ...newShopData }));
    setShowEditModal(false);
    toast.success("Shop updated successfully");
  };

  // Check if this shop belongs to the current user
  const isOwner = user && shop && user._id === shop.owner_id;

  // Loading state
  if (isLoadingShop) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-xl mb-8"></div>
            <div className="flex items-center space-x-6 mb-6">
              <div className="bg-gray-300 dark:bg-gray-700 w-32 h-32 rounded-full"></div>
              <div className="flex-1">
                <div className="bg-gray-300 dark:bg-gray-700 h-8 w-1/3 rounded mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!shop) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-text mb-2">Shop Not Found</h2>
            <p className="text-text/70">The shop you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Shop Header */}
        <motion.div 
          className="bg-card rounded-xl shadow-md mb-8 border border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row items-center">
              {/* Shop Logo */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-border shadow-md overflow-hidden">
                  {shopLogoUrl ? (
                    <img
                      src={shopLogoUrl}
                      alt={`${shop.shop_name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <BuildingStorefrontIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Shop Details */}
              <div className="md:ml-6 flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-text">{shop.shop_name}</h1>
                <p className="text-text/70 mt-1 max-w-3xl">{shop.description || "No description available"}</p>
                
                {/* Contact Quick Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-sm text-text/70">
                  {shop.contacts?.email && (
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 mr-1 text-primary/70" />
                      <span>{shop.contacts.email}</span>
                    </div>
                  )}
                  
                  {shop.contacts?.tel && (
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-1 text-primary/70" />
                      <span>{shop.contacts.tel}</span>
                    </div>
                  )}
                  
                  {shop.address?.province && (
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1 text-primary/70" />
                      <span>{shop.address.province}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Edit Button */}
              {isOwner && (
                <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                  <button
                    onClick={handleOpenModal}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
                  >
                    Edit Shop
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Shop Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with Contact & Address */}
          <motion.div 
            className="lg:col-span-1 order-last lg:order-first"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Contact Info Card */}
            <div className="bg-card rounded-xl shadow-sm border border-border/20 p-6 mb-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-primary" />
                Contact Information
              </h2>
              <div className="space-y-4 text-text/80">
                {shop.contacts?.email && (
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{shop.contacts.email}</p>
                    </div>
                  </div>
                )}
                
                {shop.contacts?.tel && (
                  <div className="flex items-start">
                    <PhoneIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{shop.contacts.tel}</p>
                    </div>
                  </div>
                )}
                
                {(shop.contacts?.line || shop.contacts?.facebook) && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <p className="font-medium">Social Media</p>
                      {shop.contacts?.line && <p>Line: {shop.contacts.line}</p>}
                      {shop.contacts?.facebook && <p>Facebook: {shop.contacts.facebook}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Address Card */}
            <div className="bg-card rounded-xl shadow-sm border border-border/20 p-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
                Location
              </h2>
              
              <div className="text-text/80">
                {shop.address && (
                  <div className="space-y-1">
                    <p>
                      {shop.address.information && <span>{shop.address.information}, </span>}
                      {shop.address.subdistrict && <span>{shop.address.subdistrict}, </span>}
                      {shop.address.district && <span>{shop.address.district}, </span>}
                      {shop.address.province && <span>{shop.address.province} </span>}
                      {shop.address.postal_code && <span>{shop.address.postal_code}</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Products Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-card rounded-xl shadow-sm border border-border/20 p-6">
              <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Products ({isLoadingProducts ? '...' : shopProducts.length})
              </h2>
              
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse bg-background dark:bg-gray-700 rounded-xl overflow-hidden h-72">
                      <div className="h-40 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : shopProducts.length > 0 ? (
                <ProductCard products={shopProducts} />
              ) : (
                <div className="py-12 text-center bg-background rounded-lg">
                  <BuildingStorefrontIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-text mb-1">No Products Found</h3>
                  <p className="text-text/70">This shop hasn't listed any products yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Shop Modal */}
      <EditShopModal
        show={showEditModal}
        onClose={handleCloseModal}
        shopData={shop}
        onSave={handleSaveShop}
      />
    </div>
  );
}