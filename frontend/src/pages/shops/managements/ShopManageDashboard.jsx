import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import { getShopProducts, getShopOrders } from "../../../services/api/ShopApi";

const ShopManageDashboard = () => {
  const { shopData } = useOutletContext() || {};
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopData?._id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch products and recent orders in parallel
        const [productsData, ordersData] = await Promise.all([
          getShopProducts(shopData._id),
          getShopOrders(shopData._id)
        ]);
        
        setProducts(productsData || []);
        
        // Sort orders by date (newest first) and take first 5
        const sortedOrders = (ordersData || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
          
        setRecentOrders(sortedOrders);
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
    }).format(value);
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

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
              <h1 className="text-2xl font-bold text-text">{shopData?.shop_name || "Your Shop"}</h1>
              <p className="text-text/70">{shopData?.description || "Welcome to your shop dashboard"}</p>
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
                  <div key={product._id} className="flex items-center">
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
              to="/shop/management/addProduct"
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
                  <div key={order._id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-text">{order.order_id || `#${order._id.slice(-6)}`}</p>
                      <p className="text-sm text-text/70">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-text">{formatCurrency(order.total_amount)}</p>
                      <Link 
                        to={`/shop/management/orders/${order._id}`}
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
            to="/shop/management/addProduct"
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