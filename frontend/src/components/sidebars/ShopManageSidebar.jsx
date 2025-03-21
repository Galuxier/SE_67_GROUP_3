import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HomeIcon, 
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  TagIcon,
  CreditCardIcon,
  TruckIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  InboxIcon,
  StarIcon,
  ExclamationCircleIcon,
  BellIcon
} from "@heroicons/react/24/outline";

const ShopManageSidebar = ({ shopData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    orders: false,
    settings: false
  });

  // Check if the current path matches exactly
  const isExactPath = (path) => {
    return location.pathname === path;
  };

  // Check if the current path includes the given path
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Auto-expand menu based on current path
  useEffect(() => {
    if (isActive("/products")) {
      setExpandedMenus(prev => ({ ...prev, products: true }));
    } else if (isActive("/orders")) {
      setExpandedMenus(prev => ({ ...prev, orders: true }));
    } else if (isActive("/settings")) {
      setExpandedMenus(prev => ({ ...prev, settings: true }));
    }
  }, [location.pathname]);

  // Set menu item styles based on active state
  const getMenuItemStyles = (path, exact = false) => {
    const isMenuActive = exact ? isExactPath(path) : isActive(path);
    return `p-2 rounded-md transition-colors ${
      isMenuActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-text hover:bg-primary/10"
    } flex items-center group`;
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 p-4 bg-bar border-r border-border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-primary rounded-md p-1.5">
            <ShoppingBagIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{shopData?.shop_name || "Shop Manager"}</h2>
            <p className="text-xs text-text/60">Shop Owner Dashboard</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-1">
          {/* Dashboard */}
          <Link
            to="/shop/management"
            className={getMenuItemStyles("/shop/management", true)}
          >
            <HomeIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Overview
          </Link>

          <Link
            to="/shop/management/dashboard"
            className={getMenuItemStyles("/shop/management/dashboard")}
          >
            <ChartBarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Analytics
          </Link>

          {/* Notifications */}
          <Link
            to="/shop/management/notifications"
            className={getMenuItemStyles("/shop/management/notifications")}
          >
            <div className="relative">
              <BellIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>
            <span>Notifications</span>
          </Link>

          {/* Products Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu('products')}
              className={`w-full ${getMenuItemStyles("/products")} justify-between`}
            >
              <div className="flex items-center">
                <CubeIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                <span>Products</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.products ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.products && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/shop/management/products"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isExactPath("/shop/management/products") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  All Products
                </Link>
                <Link
                  to="/shop/management/products/inventory"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/products/inventory") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Inventory
                </Link>
                <Link
                  to="/shop/management/products/categories"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/products/categories") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Categories
                </Link>
                <Link
                  to="/shop/management/products/create"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/products/create") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  <div className="flex items-center">
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Add Product
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu('orders')}
              className={`w-full ${getMenuItemStyles("/orders")} justify-between`}
            >
              <div className="flex items-center">
                <InboxIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                <span>Orders</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.orders ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.orders && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/shop/management/orders"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isExactPath("/shop/management/orders") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  All Orders
                </Link>
                <Link
                  to="/shop/management/orders/pending"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/orders/pending") ? "text-primary" : "text-text"
                  } text-sm transition-colors flex items-center justify-between`}
                >
                  <span>Pending</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    5
                  </span>
                </Link>
                <Link
                  to="/shop/management/orders/processing"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/orders/processing") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Processing
                </Link>
                <Link
                  to="/shop/management/orders/completed"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/orders/completed") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
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
            <UsersIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Customers
          </Link>

          {/* Reviews */}
          <Link
            to="/shop/management/reviews"
            className={`${getMenuItemStyles("/shop/management/reviews")} justify-between`}
          >
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
              <span>Reviews</span>
            </div>
            <span className="bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
              New
            </span>
          </Link>

          {/* Shipping */}
          <Link
            to="/shop/management/shipping"
            className={getMenuItemStyles("/shop/management/shipping")}
          >
            <TruckIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Shipping
          </Link>

          {/* Payments */}
          <Link
            to="/shop/management/payments"
            className={getMenuItemStyles("/shop/management/payments")}
          >
            <CreditCardIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Payments
          </Link>

          {/* Promotions */}
          <Link
            to="/shop/management/promotions"
            className={getMenuItemStyles("/shop/management/promotions")}
          >
            <TagIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Promotions
          </Link>

          {/* Settings Section */}
          <div className="space-y-1 mt-4">
            <button
              onClick={() => toggleMenu('settings')}
              className={`w-full ${getMenuItemStyles("/settings")} justify-between`}
            >
              <div className="flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                <span>Settings</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.settings ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.settings && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/shop/management/settings/profile"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/settings/profile") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Shop Profile
                </Link>
                <Link
                  to="/shop/management/settings/payment"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/settings/payment") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Payment Methods
                </Link>
                <Link
                  to="/shop/management/settings/shipping"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/settings/shipping") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Shipping Options
                </Link>
                <Link
                  to="/shop/management/settings/notifications"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    isActive("/shop/management/settings/notifications") ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Notification Settings
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Support and Help */}
        <div className="mt-auto pt-6 border-t border-border">
          <Link
            to="/shop/management/help"
            className="flex items-center text-text hover:text-primary text-sm p-2 rounded-md hover:bg-primary/10 transition-colors"
          >
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            Help & Support
          </Link>
          <Link
            to="/shop"
            className="flex items-center text-text hover:text-primary text-sm p-2 rounded-md hover:bg-primary/10 transition-colors mt-2"
          >
            ← Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopManageSidebar;