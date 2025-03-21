import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ShoppingCartIcon, 
  CubeIcon, 
  CurrencyDollarIcon, 
  UsersIcon,
  EyeIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { LineChart, BarChart, PieChart, AreaChart, Line, Bar, Pie, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ShopManagementDashboard = () => {
  const { shopData } = useOutletContext() || {};
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('weekly');

  useEffect(() => {
    // In a real app, fetch data from the backend
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          summary: {
            revenue: 12850,
            revenueChange: 12.5,
            orders: 73,
            ordersChange: -3.2,
            products: 42,
            productsChange: 0,
            customers: 56,
            customersChange: 8.7
          },
          salesData: generateSalesData(timeRange),
          productPerformance: [
            { name: 'Boxing Gloves', sales: 32, revenue: 3200 },
            { name: 'Hand Wraps', sales: 21, revenue: 840 },
            { name: 'Mouth Guards', sales: 18, revenue: 720 },
            { name: 'Training Shorts', sales: 15, revenue: 1500 },
            { name: 'Shin Guards', sales: 9, revenue: 1350 }
          ],
          categorySales: [
            { name: 'Protection', value: 35 },
            { name: 'Clothing', value: 25 },
            { name: 'Equipment', value: 20 },
            { name: 'Accessories', value: 15 },
            { name: 'Other', value: 5 }
          ],
          recentOrders: [
            { id: 'ORD-1234', customer: 'John Doe', date: '2025-03-21', status: 'Completed', total: 350 },
            { id: 'ORD-1235', customer: 'Jane Smith', date: '2025-03-20', status: 'Processing', total: 120 },
            { id: 'ORD-1236', customer: 'Mike Johnson', date: '2025-03-20', status: 'Pending', total: 540 },
            { id: 'ORD-1237', customer: 'Sara Williams', date: '2025-03-19', status: 'Completed', total: 210 },
            { id: 'ORD-1238', customer: 'Robert Brown', date: '2025-03-19', status: 'Completed', total: 150 }
          ],
          latestReviews: [
            { id: 'REV-345', product: 'Boxing Gloves', customer: 'Alex Thompson', rating: 5, comment: 'Great quality, very comfortable!', date: '2025-03-21' },
            { id: 'REV-346', product: 'Shin Guards', customer: 'Maria Garcia', rating: 4, comment: 'Good protection, a bit bulky.', date: '2025-03-20' },
            { id: 'REV-347', product: 'Hand Wraps', customer: 'David Wilson', rating: 5, comment: 'Perfect fit and great support.', date: '2025-03-19' }
          ]
        });
        setIsLoading(false);
      }, 800);
    };

    fetchDashboardData();
  }, [timeRange]);

  // Helper function to generate sales data based on time range
  const generateSalesData = (range) => {
    let data = [];
    
    if (range === 'weekly') {
      data = [
        { name: 'Mon', revenue: 1200, orders: 8 },
        { name: 'Tue', revenue: 1800, orders: 12 },
        { name: 'Wed', revenue: 1500, orders: 10 },
        { name: 'Thu', revenue: 2200, orders: 15 },
        { name: 'Fri', revenue: 2800, orders: 18 },
        { name: 'Sat', revenue: 2100, orders: 14 },
        { name: 'Sun', revenue: 1250, orders: 9 }
      ];
    } else if (range === 'monthly') {
      data = [
        { name: 'Week 1', revenue: 8500, orders: 57 },
        { name: 'Week 2', revenue: 10200, orders: 68 },
        { name: 'Week 3', revenue: 9300, orders: 62 },
        { name: 'Week 4', revenue: 12000, orders: 80 }
      ];
    } else if (range === 'yearly') {
      data = [
        { name: 'Jan', revenue: 35000, orders: 235 },
        { name: 'Feb', revenue: 32000, orders: 215 },
        { name: 'Mar', revenue: 38500, orders: 257 },
        { name: 'Apr', revenue: 40200, orders: 268 },
        { name: 'May', revenue: 42300, orders: 282 },
        { name: 'Jun', revenue: 45000, orders: 300 },
        { name: 'Jul', revenue: 47500, orders: 317 },
        { name: 'Aug', revenue: 46800, orders: 312 },
        { name: 'Sep', revenue: 48200, orders: 321 },
        { name: 'Oct', revenue: 51000, orders: 340 },
        { name: 'Nov', revenue: 55000, orders: 367 },
        { name: 'Dec', revenue: 58500, orders: 390 }
      ];
    }
    
    return data;
  };

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Helper to format date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper for status styling
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Helper for rating stars
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Shop Dashboard</h1>
        
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last Month</option>
            <option value="yearly">Last Year</option>
          </select>
          
          <button className="flex items-center px-3 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-text mt-1">{formatCurrency(dashboardData.summary.revenue)}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.summary.revenueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.summary.revenueChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.summary.revenueChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last period</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-text mt-1">{dashboardData.summary.orders}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <ShoppingCartIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.summary.ordersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.summary.ordersChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.summary.ordersChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last period</span>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-text mt-1">{dashboardData.summary.products}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <CubeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.summary.productsChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.summary.productsChange > 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : dashboardData.summary.productsChange < 0 ? (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              ) : (
                <span className="w-3 mr-1"></span>
              )}
              {Math.abs(dashboardData.summary.productsChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last period</span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-text/70 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-text mt-1">{dashboardData.summary.customers}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
              <UsersIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${dashboardData.summary.customersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {dashboardData.summary.customersChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(dashboardData.summary.customersChange)}%
            </span>
            <span className="text-text/60 text-xs ml-2">from last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Chart */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20">
          <h2 className="text-lg font-semibold mb-4 text-text">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dashboardData.salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#e11d48"
                fill="#e11d48"
                fillOpacity={0.3}
                activeDot={{ r: 8 }}
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Trends Chart */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20">
          <h2 className="text-lg font-semibold mb-4 text-text">Order Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
              />
              <Legend />
              <Bar
                dataKey="orders"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Orders"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Performance */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20">
          <h2 className="text-lg font-semibold mb-4 text-text">Product Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={dashboardData.productPerformance}
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
                formatter={(value, name) => [
                  name === "revenue" ? formatCurrency(value) : value,
                  name === "revenue" ? "Revenue" : "Sales"
                ]}
              />
              <Legend />
              <Bar dataKey="sales" fill="#8b5cf6" name="Units Sold" />
              <Bar dataKey="revenue" fill="#6366f1" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-lg shadow p-4 border border-border/20">
          <h2 className="text-lg font-semibold mb-4 text-text">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.categorySales}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {/* {dashboardData.categorySales.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={[
                      "#e11d48",
                      "#10b981",
                      "#3b82f6",
                      "#8b5cf6",
                      "#f59e0b",
                    ][index % 5]}
                  />
                ))} */}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                }}
                formatter={(value) => [`${value}%`, "Percentage"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-lg shadow border border-border/20">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Recent Orders</h2>
            <button className="text-primary hover:text-secondary text-sm font-medium">View All</button>
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
                    Date
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text/70">
                      {formatDate(order.date)}
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

        {/* Latest Reviews */}
        <div className="bg-card rounded-lg shadow border border-border/20">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text">Latest Reviews</h2>
            <button className="text-primary hover:text-secondary text-sm font-medium">View All</button>
          </div>
          <div className="p-4 space-y-4">
            {dashboardData.latestReviews.map((review) => (
              <div key={review.id} className="p-3 border border-border/40 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-medium text-text">{review.product}</h3>
                  <span className="text-xs text-text/60">{formatDate(review.date)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <RatingStars rating={review.rating} />
                  <span className="ml-2 text-sm text-text/70">{review.rating}/5</span>
                </div>
                <p className="text-text/70 text-sm mt-2">"{review.comment}"</p>
                <p className="text-text/60 text-xs mt-1">by {review.customer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopManagementDashboard;