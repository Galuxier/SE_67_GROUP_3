// ShopManageSidebar.jsx - ปรับปรุงใหม่ให้มีขนาดเล็กลงและเรียบง่ายขึ้น
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
} from "@heroicons/react/24/outline";

const ShopManageSidebar = ({ shopData, userShops = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({
    shops: false,
    products: true,
    orders: false,
    settings: false
  });

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

  // Set menu item styles based on active state
  const getMenuItemStyles = (path) => {
    return `p-1.5 rounded text-sm ${
      isActive(path) 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-text hover:bg-gray-100 dark:hover:bg-gray-700"
    } flex items-center transition-colors`;
  };

  // เปลี่ยนร้านค้า
  const handleShopChange = (shopId) => {
    navigate(`/shop/management/${shopId}`);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-56 p-3 bg-bar border-r border-border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <div className="flex flex-col h-full">
        {/* Header - ปรับให้กะทัดรัด */}
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
          <div className="bg-primary rounded p-1">
            <ShoppingBagIcon className="h-4 w-4 text-white" />
          </div>
          <div className="truncate">
            <h2 className="text-sm font-bold text-text">{shopData?.shop_name || "Shop Manager"}</h2>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-0.5 text-sm">
          {/* Shop Switcher - ถ้ามีหลายร้าน */}
          {userShops.length > 1 && (
            <div className="mb-1">
              <button
                onClick={() => toggleMenu('shops')}
                className={`w-full ${getMenuItemStyles("/shops")} justify-between`}
              >
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-4 w-4 mr-2" />
                  <span>My Shops</span>
                </div>
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${expandedMenus.shops ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedMenus.shops && (
                <div className="pl-6 mt-0.5 space-y-0.5">
                  {userShops.map(shop => (
                    <button
                      key={shop._id}
                      onClick={() => handleShopChange(shop._id)}
                      className={`block p-1.5 rounded w-full text-left text-xs ${
                        shopData?._id === shop._id ? "text-primary font-medium" : "text-text"
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      {shop.shop_name}
                    </button>
                  ))}
                  <Link
                    to="/shop/register"
                    className="block p-1.5 rounded text-xs text-text hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <PlusCircleIcon className="h-3 w-3 mr-1.5" />
                      New Shop
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

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
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  All Products
                </Link>
                <Link
                  to="/shop/management/products/inventory"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Inventory
                </Link>
                <Link
                  to="/shop/management/products/create"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
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
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  All Orders
                </Link>
                <Link
                  to="/shop/management/orders/pending"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span>Pending</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 rounded-full">
                    5
                  </span>
                </Link>
                <Link
                  to="/shop/management/orders/processing"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Processing
                </Link>
                <Link
                  to="/shop/management/orders/completed"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Shop Profile
                </Link>
                <Link
                  to="/shop/management/settings/payment"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Payment Methods
                </Link>
                <Link
                  to="/shop/management/settings/shipping"
                  className="block p-1.5 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Shipping Options
                </Link>
              </div>
            )}
          </div>
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
  );
};

export default ShopManageSidebar;