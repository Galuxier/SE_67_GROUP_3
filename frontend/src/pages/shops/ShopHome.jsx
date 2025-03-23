import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, TagIcon, FireIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import ShopFilter from "../../components/shops/ShopFilter";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getProducts } from "../../services/api/ProductApi";
import { toast } from "react-toastify"; 

function ShopHome() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState(["All"]);

  // Categories for quick filtering
  // const categories = ["All", "Gloves", "Protection", "Apparel", "Accessories", "Equipment"];

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products from API
        const response = await getProducts();
        
        // Handle the response
        const fetchedProducts = response.data;
        console.log("Fetched products:", fetchedProducts);
        
        // Update state with fetched products
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        
        // Extract unique categories from products
        if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
          const uniqueCategories = [...new Set(fetchedProducts.map(product => product.category))];
          setCategories(["All", ...uniqueCategories.filter(Boolean)]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again later.");
        
        // Use dummy data as fallback
        // This could be removed in production, but it's helpful during development
        const dummyProducts = [
          {
            id: 1,
            product_name: "Muay Thai Boxing Gloves",
            description: "Professional grade boxing gloves for training and competition",
            image_url: new URL("../../assets/images/Glove_black.jpg", import.meta.url).href,
            price: 1200,
            category: "Gloves",
            shop_name: "FightGear Pro",
            isNew: true
          },
          {
            id: 2,
            product_name: "Hand Wraps - 180cm",
            description: "Premium quality hand wraps for maximum wrist support",
            image_url: new URL("../../assets/images/product-003.webp", import.meta.url).href,
            price: 350,
            category: "Accessories",
            shop_name: "FightGear Pro"
          },
          // ... other dummy products
        ];
        
        // setProducts(dummyProducts);
        // setFilteredProducts(dummyProducts);
        
        // Extract categories from dummy data as well
        // const uniqueCategories = [...new Set(dummyProducts.map(product => product.category))];
        // setCategories(["All", ...uniqueCategories.filter(Boolean)]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // Apply filters when they change
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.product_name?.toLowerCase().includes(query) || 
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.shop_name?.toLowerCase().includes(query)
      );
    }

    // Apply price filter
    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, searchQuery, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setPriceFilter("");
    setSortOrder("");
    setSearchQuery("");
    setActiveCategory("All");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Loading skeleton UI
  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill().map((_, index) => (
        <div key={index} className="animate-pulse bg-card border border-border/30 rounded-xl overflow-hidden shadow-md">
          <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
          <div className="p-4">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Hero Banner with search functionality */}
      <div className="relative bg-gradient-to-r from-purple-600 to-primary overflow-hidden z-0">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-white">
            <defs>
              <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-16">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Shop <span className="text-yellow-300">Muay Thai</span> Equipment
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              Find premium quality gear for training and competition from trusted brands
            </p>
            
            {/* Search Bar */}
            <div className="relative left-5 flex items-center max-w-xl">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search products, categories, or shops..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 pl-5 pr-12 rounded-full border-0 shadow-lg text-gray-800 focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 text-gray-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-12 -mt-12 relative z-20">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar snap-x">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium snap-start ${
                activeCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-card hover:bg-gray-200 dark:hover:bg-gray-700 text-text"
              } transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel for Desktop */}
          <motion.div 
            className="hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 overflow-hidden flex-shrink-0 h-fit sticky top-28"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-5 bg-primary text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filter Products</h3>
                <button onClick={handleClearFilters} className="text-sm underline hover:text-white/80">
                  Clear All
                </button>
              </div>  
            </div>
            
            <div className="p-5">
              <ShopFilter
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
          </motion.div>

          {/* Main Products Content */}
          <div className="flex-grow">
            {/* Stats and Controls for results */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <TagIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-bold text-text">
                  {isLoading 
                    ? "Finding products..."
                    : filteredProducts.length > 0 
                      ? `${filteredProducts.length} Products ${activeCategory !== "All" ? `in ${activeCategory}` : "Found"}`
                      : "No products matching your criteria"
                  }
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Active filters display */}
                {(activeCategory !== "All" || searchQuery) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {activeCategory !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {activeCategory}
                        <button 
                          onClick={() => setActiveCategory("All")}
                          className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                    
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        Search: {searchQuery}
                        <button 
                          onClick={() => {
                            setSearchQuery("");
                            if (searchInputRef.current) {
                              searchInputRef.current.value = "";
                            }
                          }}
                          className="ml-1 text-amber-600 hover:text-amber-800 dark:text-amber-400"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                  </div>
                )}
                
                {/* Sort dropdown */}
                <select 
                  className="py-2 px-3 rounded-lg border border-border text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
                
                {/* Filter button for mobile */}
                <button
                  onClick={toggleFilterModal}
                  className="lg:hidden bg-primary hover:bg-secondary text-white flex items-center gap-2 rounded-lg py-2 px-4 transition-colors"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Products List */}
            {isLoading ? (
              renderSkeletonCards()
            ) : filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <ProductCard products={filteredProducts} />
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl shadow-md">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-text">No products found</h3>
                <p className="mt-1 text-text/70">Try adjusting your search or filter criteria</p>
                <div className="mt-6">
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Product button for shop owners */}
        {user && user.role && user.role.includes("shop_owner") && (
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
        )}
      </div>  

      {/* Modal for Filter on Mobile */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter Products</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                &times;
              </button>
            </div>
            <ShopFilter
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  toggleFilterModal();
                  // Apply filters if needed
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopHome;