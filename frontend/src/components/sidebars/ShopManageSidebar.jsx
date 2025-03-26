/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { getImage } from "../../services/api/ImageApi";

const ShopManageSidebar = ({ shopData, userShops = [], onSwitchShop }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expandedMenus, setExpandedMenus] = useState({
    shops: userShops.length > 1,
    products: true,
    orders: false,
    settings: false,
  });
  const [showShopSwitcher, setShowShopSwitcher] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch shop logo when shopData changes
  const fetchLogo = useCallback(async () => {
    if (!shopData?.logo_url) {
      setLogoPreview(null);
      return;
    }

    try {
      const logoData = await getImage(shopData.logo_url);
      setLogoPreview(logoData); // Assuming getImage returns a URL or Blob
    } catch (error) {
      console.error("Error fetching shop logo:", error);
      setLogoPreview(null);
    }
  }, [shopData?.logo_url]);

  useEffect(() => {
    fetchLogo();
    // Cleanup not needed unless logoData is a Blob URL requiring revocation
  }, [fetchLogo]);

  // Check if the current path matches or includes the given path
  const isActive = useCallback(
    (path) => {
      return window.location.pathname.includes(path);
    },
    [] // No dependencies since it only checks window.location.pathname
  );

  // Toggle menu expansion
  const toggleMenu = useCallback((menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  }, []);

  // Set menu item styles based on active state
  const getMenuItemStyles = useCallback(
    (path) => {
      return `p-2 rounded-lg text-sm ${
        isActive(path)
          ? "bg-primary/10 text-primary font-medium"
          : "text-text hover:bg-gray-100 dark:hover:bg-gray-700"
      } flex items-center transition-colors`;
    },
    [isActive]
  );

  // Handle shop change
  const handleShopChange = useCallback(
    (shopId) => {
      if (onSwitchShop) {
        onSwitchShop(shopId);
      } else {
        navigate(`/shop/management/${shopId}`, { replace: true });
      }
      setShowShopSwitcher(false);
    },
    [onSwitchShop, navigate]
  );

  const showMultipleShops = userShops.length > 0;

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 p-3 bg-bar border-r border-border overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent z-10">
        <div className="flex flex-col h-full">
          {/* Current Shop Header */}
          <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-border/50">
            {shopData ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={shopData.shop_name}
                      className="h-8 w-8 rounded-full object-cover border border-border/50"
                    />
                  ) : (
                    <div className="bg-primary/20 rounded-full p-1 h-8 w-8 flex items-center justify-center">
                      <ShoppingBagIcon className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="truncate">
                    <h2 className="text-sm font-bold text-text truncate">
                      {shopData.shop_name || "Shop Manager"}
                    </h2>
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
                <h2 className="text-sm font-bold text-text">Shop Manager</h2>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-col space-y-1 text-sm">
            <Link
              to={`/shop/management${shopData ? `/${shopData._id}` : ""}`}
              className={getMenuItemStyles("/management")}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Overview
            </Link>
            {shopData && (
              <Link
                to={`/shop/management/${shopData._id}/detail`}
                className={getMenuItemStyles("/detail")}
              >
                <BuildingStorefrontIcon className="h-4 w-4 mr-2" />
                Shop Info
              </Link>
            )}
            {shopData && (
              <Link
                to={`/shop/management/${shopData._id}/dashboard`}
                className={getMenuItemStyles("/dashboard")}
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            )}

            {/* Products Section */}
            {shopData && (
              <div>
                <button
                  onClick={() => toggleMenu("products")}
                  className={`w-full ${getMenuItemStyles("/products")} justify-between`}
                >
                  <div className="flex items-center">
                    <CubeIcon className="h-4 w-4 mr-2" />
                    <span>Products</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${
                      expandedMenus.products ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus.products && (
                  <div className="pl-6 mt-0.5 space-y-0.5">
                    <Link
                      to={`/shop/management/${shopData._id}/products`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      All Products
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/products/inventory`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      Inventory
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/addProduct`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text flex items-center"
                    >
                      <PlusCircleIcon className="h-3 w-3 mr-1.5" />
                      Add Product
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Orders Section */}
            {shopData && (
              <div>
                <button
                  onClick={() => toggleMenu("orders")}
                  className={`w-full ${getMenuItemStyles("/orders")} justify-between`}
                >
                  <div className="flex items-center">
                    <InboxIcon className="h-4 w-4 mr-2" />
                    <span>Orders</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${
                      expandedMenus.orders ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus.orders && (
                  <div className="pl-6 mt-0.5 space-y-0.5">
                    <Link
                      to={`/shop/management/${shopData._id}/orders`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      All Orders
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/orders/pending`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text flex items-center justify-between"
                    >
                      <span>Pending</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                        New
                      </span>
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/orders/processing`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      Processing
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/orders/completed`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      Completed
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Customers */}
            {shopData && (
              <Link
                to={`/shop/management/${shopData._id}/customers`}
                className={getMenuItemStyles("/customers")}
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                Customers
              </Link>
            )}

            {/* Shipping */}
            {shopData && (
              <Link
                to={`/shop/management/${shopData._id}/shipping`}
                className={getMenuItemStyles("/shipping")}
              >
                <TruckIcon className="h-4 w-4 mr-2" />
                Shipping
              </Link>
            )}

            {/* Payments */}
            {shopData && (
              <Link
                to={`/shop/management/${shopData._id}/payments`}
                className={getMenuItemStyles("/payments")}
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Payments
              </Link>
            )}

            {/* Settings Section */}
            {shopData && (
              <div className="mt-2">
                <button
                  onClick={() => toggleMenu("settings")}
                  className={`w-full ${getMenuItemStyles("/settings")} justify-between`}
                >
                  <div className="flex items-center">
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${
                      expandedMenus.settings ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenus.settings && (
                  <div className="pl-6 mt-0.5 space-y-0.5">
                    <Link
                      to={`/shop/management/${shopData._id}/settings/profile`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      Shop Profile
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/settings/payment`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      Payment Methods
                    </Link>
                    <Link
                      to={`/shop/management/${shopData._id}/settings/shipping`}
                      className="block p-1.5 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                    >
                      Shipping Options
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* All My Shops Section */}
            {showMultipleShops && (
              <div className="mt-5 pt-5 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-text/60 uppercase">
                    My Shops
                  </h3>
                  <Link
                    to="/shop/management/addShop"
                    className="text-primary hover:text-secondary text-xs"
                  >
                    <PlusCircleIcon className="inline-block h-3 w-3 mr-1" />
                    New
                  </Link>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {userShops.map((shop) => (
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
                          src={logoPreview}
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
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {userShops.map((shop) => (
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
                        src={logoPreview}
                        alt={shop.shop_name}
                        className="h-12 w-12 rounded-full object-cover mr-3 border border-border/50"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        <BuildingStorefrontIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          shopData?._id === shop._id ? "text-primary" : "text-text"
                        }`}
                      >
                        {shop.shop_name}
                      </h4>
                      <p className="text-sm text-text/70 truncate">
                        {shop.description || "No description"}
                      </p>
                    </div>
                    {shopData?._id === shop._id && (
                      <div className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                        Current
                      </div>
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