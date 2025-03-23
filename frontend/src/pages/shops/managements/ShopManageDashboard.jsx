import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  BanknotesIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { getShopProducts, getShopOrders } from "../../../services/api/ShopApi";

const ShopManageDashboard = () => {
  // Get shop data from outlet context
  const { shopData, userShops } = useOutletContext() || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [shopStats, setShopStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [error, setError] = useState(null);

  // Debug log to check what data we're receiving
  useEffect(() => {
    console.log("ShopManageDashboard received context:", { 
      hasShopData: !!shopData, 
      shopId: shopData?._id,
      shopName: shopData?.shop_name,
      userShopsCount: userShops?.length 
    });
  }, [shopData, userShops]);

  // Fetch shop data when shopData changes
  useEffect(() => {
    const fetchShopData = async () => {
      // Only fetch if we have valid shop data with an ID
      if (!shopData || !shopData._id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching data for shop:", shopData._id);
        
        // Fetch products and recent orders in parallel
        const [productsData, ordersData] = await Promise.all([
          getShopProducts(shopData._id),
          getShopOrders(shopData._id)
        ]);
        
        
        
        // Set products data
        const productList = Array.isArray(productsData) ? productsData : [];
        setProducts(productList);
        
        // Set orders data and calculate statistics
        const ordersList = Array.isArray(ordersData) ? ordersData : [];
        
        // Sort orders by date (newest first) and take first 5
        const sortedOrders = ordersList
          .sort((a, b) => new Date(b.created_at || b.createdAt || Date.now()) - 
                         new Date(a.created_at || a.createdAt || Date.now()))
          .slice(0, 5);
          
        setRecentOrders(sortedOrders);
        
        // Calculate shop statistics
        const pendingOrdersCount = ordersList.filter(
          order => order.status?.toLowerCase() === "pending"
        ).length;
        
        const totalRevenue = ordersList.reduce(
          (sum, order) => sum + (parseFloat(order.total_amount) || 0), 
          0
        );
        
        setShopStats({
          totalProducts: productList.length,
          totalOrders: ordersList.length,
          totalRevenue,
          pendingOrders: pendingOrdersCount
        });
        
      } catch (err) {
        console.error("Error fetching shop dashboard data:", err);
        setError("Failed to load shop data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [shopData]);

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  // Helper for status styles
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // If no shop data available, show create shop message
  if (!shopData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="bg-card w-full max-w-xl p-8 rounded-xl shadow-lg border border-border/30">
          <ShoppingBagIcon className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text mb-2">Create Your First Shop</h2>
          <p className="text-text/70 mb-6">
            Get started by creating your first shop to showcase and sell your Muay Thai products.
          </p>
          <Link 
            to="/shop/management/addShop"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Create Shop
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-3"></div>
          <p className="text-text/70">Loading shop data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card rounded-lg shadow border border-border/20 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-text mb-2">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 inline-block mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {shopData?.logo_url ? (
                <img src={shopData.logo_url} alt="Shop Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20">
                  <ShoppingBagIcon className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text">{shopData?.shop_name || "Shop Dashboard"}</h1>
              <p className="text-text/70">{shopData?.description || "Manage your products and orders"}</p>
            </div>
          </div>
          <div>
            <Link
              to="/shop/management/settings/profile"
              className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-text transition-colors"
            >
              Edit Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border/30 shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
              <ShoppingBagIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text/60">Total Products</h3>
              <div className="text-2xl font-semibold text-text">{shopStats.totalProducts}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border/30 shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text/60">Total Orders</h3>
              <div className="text-2xl font-semibold text-text">{shopStats.totalOrders}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border/30 shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <BanknotesIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text/60">Total Revenue</h3>
              <div className="text-2xl font-semibold text-text">{formatCurrency(shopStats.totalRevenue)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border/30 shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text/60">Pending Orders</h3>
              <div className="text-2xl font-semibold text-text">{shopStats.pendingOrders}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Summary */}
        <div className="bg-card rounded-lg shadow border border-border/20">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Products</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {products.length} Total
            </span>
          </div>
          
          <div className="p-4">
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product._id || product.id} className="flex items-center">
                    <div className="w-12 h-12 rounded overflow-hidden mr-3">
                      <img 
                        src={product.image_url || "/api/placeholder/100/100"} 
                        alt={product.product_name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-text font-medium line-clamp-1">{product.product_name}</p>
                      <p className="text-text/70 text-sm">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="text-sm text-text/70 font-medium">
                      Stock: {product.stock}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-text/70">
                <p>No products yet</p>
                <p className="text-sm">Add your first product to get started.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-border">
            <Link
              to={`/shop/management/${shopData._id}/addProduct`}
              className="flex items-center justify-center w-full py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors text-center font-medium"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add New Product
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-lg shadow border border-border/20">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Recent Orders</h2>
            <Link to="/shop/management/orders" className="text-primary hover:text-secondary text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="p-4">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order._id || order.id} 
                    className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-text">{order.order_id || `#${(order._id || order.id).toString().slice(-6)}`}</p>
                      <p className="text-sm text-text/70">
                        {new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-text">{formatCurrency(order.total_amount)}</p>
                      <Link 
                        to={`/shop/management/orders/${order._id || order.id}`}
                        className="text-xs text-primary hover:text-secondary"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-text/70">
                <ClipboardDocumentListIcon className="mx-auto h-10 w-10 text-text/50 mb-2" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-card rounded-lg shadow border border-border/20">
        <h2 className="text-lg font-semibold mb-4 text-text">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to={`/shop/management/${shopData._id}/addProduct`}
            className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors"
          >
            <ShoppingBagIcon className="h-8 w-8 mx-auto text-primary mb-2" />
            <span className="text-text font-medium">Add Product</span>
          </Link>
          
          <Link
            to="/shop/management/orders"
            className="p-4 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg text-center transition-colors"
          >
            <ClipboardDocumentListIcon className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
            <span className="text-text font-medium">Manage Orders</span>
          </Link>
          
          <Link
            to="/shop/management/settings/profile"
            className="p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg text-center transition-colors"
          >
            <ShoppingBagIcon className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-text font-medium">Shop Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopManageDashboard;