import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const ShopManageDashboard = () => {
  const { shopData } = useOutletContext() || {};
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // For now, we'll simulate loading some data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          salesSummary: {
            revenue: 12500,
            revenueChange: 8.5,
            orders: 67,
            ordersChange: 12.3,
            customers: 45,
            customersChange: 5.2,
            products: 32,
            productsChange: -2.1
          },
          recentOrders: [
            { id: "ORD-1234", customer: "John Doe", date: "2025-03-21", status: "Completed", total: 350 },
            { id: "ORD-1235", customer: "Jane Smith", date: "2025-03-20", status: "Processing", total: 120 },
            { id: "ORD-1236", customer: "Mike Johnson", date: "2025-03-20", status: "Pending", total: 540 }
          ],
          topProducts: [
            { id: 1, name: "Boxing Gloves", sales: 12, image: "/api/placeholder/50/50" },
            { id: 2, name: "Hand Wraps", sales: 8, image: "/api/placeholder/50/50" },
            { id: 3, name: "Mouth Guard", sales: 6, image: "/api/placeholder/50/50" }
          ]
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

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
    switch (status.toLowerCase()) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-text mt-1">{formatCurrency(dashboardData.salesSummary.revenue)}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.salesSummary.revenueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.salesSummary.revenueChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.salesSummary.revenueChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last month</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-text mt-1">{dashboardData.salesSummary.orders}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <ClipboardDocumentListIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.salesSummary.ordersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.salesSummary.ordersChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.salesSummary.ordersChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last month</span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Customers</p>
              <p className="text-2xl font-bold text-text mt-1">{dashboardData.salesSummary.customers}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <UsersIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.salesSummary.customersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.salesSummary.customersChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.salesSummary.customersChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last month</span>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Products</p>
              <p className="text-2xl font-bold text-text mt-1">{dashboardData.salesSummary.products}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
              <ShoppingBagIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.salesSummary.productsChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.salesSummary.productsChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.salesSummary.productsChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-lg shadow border border-border/20">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Recent Orders</h2>
            <Link to="/shop/management/orders" className="text-primary hover:text-secondary text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text/70">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-lg shadow border border-border/20">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Top Products</h2>
            <Link to="/shop/management/products" className="text-primary hover:text-secondary text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="px-6 py-4 space-y-4">
            {dashboardData.topProducts.map((product) => (
              <div key={product.id} className="flex items-center">
                <div className="w-10 h-10 flex-shrink-0 mr-3">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-grow">
                  <p className="text-text font-medium">{product.name}</p>
                  <p className="text-text/70 text-sm">{product.sales} sold</p>
                </div>
                <Link to={`/shop/management/products/${product.id}`} className="text-primary hover:text-secondary text-sm">
                  Details
                </Link>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <Link
              to="/shop/management/addProduct"
              className="block w-full py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors text-center font-medium"
            >
              Add New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-card rounded-lg shadow border border-border/20">
        <h2 className="text-lg font-semibold mb-4 text-text">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            to="/shop/management/customers"
            className="p-4 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 rounded-lg text-center transition-colors"
          >
            <UsersIcon className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-text font-medium">Customers</span>
          </Link>
          
          <Link
            to="/shop/management/dashboard"
            className="p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg text-center transition-colors"
          >
            <ChartBarIcon className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-text font-medium">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopManageDashboard;