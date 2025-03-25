import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon, TagIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import ShopFilter from "../../components/shops/ShopFilter";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getProducts } from "../../services/api/ProductApi";
import { toast } from "react-toastify";

function ShopHome() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [products, setProducts] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState(["All"]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const productsPerPage = 40;

  const toTitleCase = (str) => {
    if (!str || str === "All") return str;
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let minPrice, maxPrice;
        if (priceFilter) {
          const [min, max] = priceFilter.split('-').map(Number);
          minPrice = min;
          maxPrice = max;
        }

        const params = {
          page: currentPage,
          limit: productsPerPage,
          query: searchQuery || undefined,
          category: categoryFilter !== "All" ? categoryFilter : undefined,
          min_price: minPrice,
          max_price: maxPrice,
          sort: sortOrder || undefined
        };

        const response = await getProducts(params);
        
        const formattedProducts = response.data.map(product => ({
          ...product,
          category: toTitleCase(product.category)
        }));

        setProducts(formattedProducts);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);

        const uniqueCategories = [...new Set(response.data.map(product => toTitleCase(product.category)))];
        setCategories(["All", ...uniqueCategories.filter(Boolean)]);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again later.");
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, categoryFilter, priceFilter, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const handleClearFilters = () => {
    setCategoryFilter("All");
    setPriceFilter("");
    setSortOrder("");
    setSearchQuery("");
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(8).fill().map((_, index) => (
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
      {/* Hero Banner */}
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
            <div className="relative left-5 flex items-center max-w-xl">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search products, categories, or shops..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 pl-5 pr-12 rounded-full border-0 shadow-lg text-gray-800 focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pb-12 -mt-12 relative z-20">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row pt-20 gap-6">
          {/* Filter Panel - Sticky */}
          <motion.div 
            className="hidden lg:block lg:w-72 bg-card rounded-2xl shadow-lg border border-border/30 overflow-hidden flex-shrink-0 sticky top-4 self-start" // ปรับ top-28 เป็น top-4 และเพิ่ม self-start
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
                categories={categories}
              />
            </div>
          </motion.div>

          {/* Main Products Content */}
          <div className="flex-grow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <TagIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-xl font-bold text-text">
                  {isLoading 
                    ? "Finding products..."
                    : products.length > 0 
                      ? `${totalItems} Products ${categoryFilter !== "All" ? `in ${categoryFilter}` : "Found"}`
                      : "No products matching your criteria"
                  }
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {(categoryFilter !== "All" || searchQuery || priceFilter) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {categoryFilter !== "All" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {categoryFilter}
                        <button 
                          onClick={() => setCategoryFilter("All")}
                          className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400"
                        >
                          ×
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
                          ×
                        </button>
                      </span>
                    )}
                    {priceFilter && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Price: {priceFilter}
                        <button 
                          onClick={() => setPriceFilter("")}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
                <select 
                  className="py-2 px-3 rounded-lg border border-border text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
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
            ) : products.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <ProductCard products={products} />
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
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

        {/* Add Product/View Cart Button */}
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
                ×
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
                onClick={toggleFilterModal}
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