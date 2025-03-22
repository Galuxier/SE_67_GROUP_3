/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HomeIcon, 
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  CreditCardIcon,
  TruckIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  InboxIcon,
  BuildingStorefrontIcon,
  ArrowPathIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const ShopManageSidebar = ({ shopData, userShops = [], onSwitchShop }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    shops: userShops.length > 1, // Auto-expand shops menu if user has multiple shops
    products: true,
    orders: false,
    settings: false
  });
  
  // Local state for shop switcher modal
  const [showShopSwitcher, setShowShopSwitcher] = useState(false);

  // Check if the current path includes the given path
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Toggle menu expansion
  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Set menu item styles based on active state
  const getMenuItemStyles = (path) => {
    return `p-2 rounded-lg text-sm ${
      isActive(path) 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-text hover:bg-gray-100 dark:hover:bg-gray-700"
    } flex items-center transition-colors`;
  };

  // Handle shop change
  const handleShopChange = (shopId) => {
    if (onSwitchShop) {
      onSwitchShop(shopId);
    } else {
      navigate(`/shop/management/${shopId}`);
    }
    setShowShopSwitcher(false);
  };

  // Determine if multiple shops section should be shown
  const showMultipleShops = userShops && userShops.length > 0;

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 p-3 bg-bar border-r border-border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent z-10">
        <div className="flex flex-col h-full">
          {/* Current Shop Header */}
          <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-border/50">
            {shopData ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  {shopData.logo_url ? (
                    <img 
                      src={shopData.logo_url} 
                      alt={shopData.shop_name}
                      className="h-8 w-8 rounded-full object-cover border border-border/50"
                    />
                  ) : (
                    <div className="bg-primary/20 rounded-full p-1 h-8 w-8 flex items-center justify-center">
                      <ShoppingBagIcon className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="truncate">
                    <h2 className="text-sm font-bold text-text truncate">{shopData.shop_name || "Shop Manager"}</h2>
                  </div>
                </div>
                
                {userShops.length > 1 && (
                  <button 
                    onClick={() => setShowShopSwitcher(true)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text/70 hover:text-primary transition-colors"
                    title="Switch Shop"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded p-1">
                  <ShoppingBagIcon className="h-4 w-4 text-white" />
                </div>
                <div className="truncate">
                  <h2 className="text-sm font-bold text-text">Shop Manager</h2>
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-col space-y-1 text-sm">
            {/* Dashboard */}
            <Link
              to="/shop/management"
              className={getMenuItemStyles("/shop/management")}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Overview
            </Link>

            <Link
              to="/shop/management/dashboard"
              className={getMenuItemStyles("/shop/management/dashboard")}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Analytics
            </Link>

            {/* Products Section */}
            <div>
              <button
                onClick={() => toggleMenu('products')}
                className={`w-full ${getMenuItemStyles("/products")} justify-between`}
              >
                <div className="flex items-center">
                  <CubeIcon className="h-4 w-4 mr-2" />
                  <span>Products</span>
                </div>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${expandedMenus.products ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedMenus.products && (
                <div className="pl-6 mt-0.5 space-y-0.5">
                  <Link
                    to="/shop/management/products"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/shop/management/products/inventory"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    Inventory
                  </Link>
                  <Link
                    to="/shop/management/addProduct"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text flex items-center"
                  >
                    <PlusCircleIcon className="h-3 w-3 mr-1.5" />
                    Add Product
                  </Link>
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div>
              <button
                onClick={() => toggleMenu('orders')}
                className={`w-full ${getMenuItemStyles("/orders")} justify-between`}
              >
                <div className="flex items-center">
                  <InboxIcon className="h-4 w-4 mr-2" />
                  <span>Orders</span>
                </div>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${expandedMenus.orders ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedMenus.orders && (
                <div className="pl-6 mt-0.5 space-y-0.5">
                  <Link
                    to="/shop/management/orders"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    All Orders
                  </Link>
                  <Link
                    to="/shop/management/orders/pending"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text flex items-center justify-between"
                  >
                    <span>Pending</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                      New
                    </span>
                  </Link>
                  <Link
                    to="/shop/management/orders/processing"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    Processing
                  </Link>
                  <Link
                    to="/shop/management/orders/completed"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    Completed
                  </Link>
                </div>
              )}
            </div>

            {/* Customers */}
            <Link
              to="/shop/management/customers"
              className={getMenuItemStyles("/shop/management/customers")}
            >
              <UsersIcon className="h-4 w-4 mr-2" />
              Customers
            </Link>

            {/* Shipping */}
            <Link
              to="/shop/management/shipping"
              className={getMenuItemStyles("/shop/management/shipping")}
            >
              <TruckIcon className="h-4 w-4 mr-2" />
              Shipping
            </Link>

            {/* Payments */}
            <Link
              to="/shop/management/payments"
              className={getMenuItemStyles("/shop/management/payments")}
            >
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Payments
            </Link>

            {/* Settings Section */}
            <div className="mt-2">
              <button
                onClick={() => toggleMenu('settings')}
                className={`w-full ${getMenuItemStyles("/settings")} justify-between`}
              >
                <div className="flex items-center">
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </div>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${expandedMenus.settings ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedMenus.settings && (
                <div className="pl-6 mt-0.5 space-y-0.5">
                  <Link
                    to="/shop/management/settings/profile"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    Shop Profile
                  </Link>
                  <Link
                    to="/shop/management/settings/payment"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    Payment Methods
                  </Link>
                  <Link
                    to="/shop/management/settings/shipping"
                    className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                  >
                    Shipping Options
                  </Link>
                </div>
              )}
            </div>
            
            {/* All My Shops Section */}
            {showMultipleShops && (
              <div className="mt-5 pt-5 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-text/60 uppercase">My Shops</h3>
                  <Link
                    to="/shop/management/addShop"
                    className="text-primary hover:text-secondary text-xs"
                  >
                    <PlusCircleIcon className="inline-block h-3 w-3 mr-1" />
                    New
                  </Link>
                </div>
                
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {userShops.map(shop => (
                    <button
                      key={shop._id}
                      onClick={() => handleShopChange(shop._id)}
                      className={`w-full p-2 rounded-lg text-left text-xs flex items-center ${
                        shopData?._id === shop._id 
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-text hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {shop.logo_url ? (
                        <img 
                          src={shop.logo_url} 
                          alt={shop.shop_name}
                          className="h-6 w-6 rounded-full object-cover mr-2 border border-border/50"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                          <BuildingStorefrontIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="truncate">{shop.shop_name}</span>
                      {shopData?._id === shop._id && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer Link */}
          <div className="mt-auto pt-4 border-t border-border/50 text-xs">
            <Link
              to="/shop"
              className="flex items-center text-text/80 hover:text-primary p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ← Return to Shop
            </Link>
          </div>
        </div>
      </div>
      
      {/* Shop Switcher Modal */}
      {showShopSwitcher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden border border-border/30">
            <div className="p-4 border-b border-border/30 flex justify-between items-center">
              <h3 className="font-semibold text-text">Switch Shop</h3>
              <button 
                onClick={() => setShowShopSwitcher(false)}
                className="text-text/70 hover:text-text"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {userShops.map(shop => (
                  <button
                    key={shop._id}
                    onClick={() => handleShopChange(shop._id)}
                    className={`w-full p-3 rounded-lg text-left flex items-center ${
                      shopData?._id === shop._id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-card hover:bg-gray-100 dark:hover:bg-gray-700 border border-border/30"
                    }`}
                  >
                    {shop.logo_url ? (
                      <img 
                        src={shop.logo_url} 
                        alt={shop.shop_name}
                        className="h-12 w-12 rounded-full object-cover mr-3 border border-border/50"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        <BuildingStorefrontIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className={`font-medium ${shopData?._id === shop._id ? "text-primary" : "text-text"}`}>{shop.shop_name}</h4>
                      <p className="text-sm text-text/70 truncate">{shop.description || "No description"}</p>
                    </div>
                    {shopData?._id === shop._id && (
                      <div className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-medium">Current</div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/30">
                <Link
                  to="/shop/management/addShop"
                  className="flex items-center justify-center w-full p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setShowShopSwitcher(false)}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Create New Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopManageSidebar;