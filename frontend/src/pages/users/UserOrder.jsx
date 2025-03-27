import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarIcon,
  ClockIcon,
  ShoppingBagIcon,
  TicketIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getUserOrders } from "../../services/api/OrderApi";
import { format } from "date-fns";

const OrderStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

const OrderTypeIcon = ({ type }) => {
  switch (type?.toLowerCase()) {
    case "product":
      return <ShoppingBagIcon className="w-5 h-5 text-indigo-500" />;
    case "ticket":
      return <TicketIcon className="w-5 h-5 text-purple-500" />;
    case "course":
      return <AcademicCapIcon className="w-5 h-5 text-blue-500" />;
    case "ads_package":
      return <CalendarIcon className="w-5 h-5 text-amber-500" />;
    default:
      return <ShoppingBagIcon className="w-5 h-5 text-gray-500" />;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "PPP");
  } catch (error) {
    return "Invalid date";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getUserOrders(user._id);
        
        // For demo purposes - when API is not connected, use mock data
        let ordersData = [];
        if (response?.data?.length > 0) {
          ordersData = response.data;
        } else {
          // Use mock data for demonstration
          ordersData = getMockOrders();
        }

        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    applyFilters();
  }, [searchQuery, statusFilter, typeFilter, timeFilter, orders]);

  const applyFilters = () => {
    let result = [...orders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.order_id?.toLowerCase().includes(query) ||
          order.items?.some((item) => 
            item.product_name?.toLowerCase().includes(query)
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(
        (order) => order.order_type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date();
      let filterDate = new Date();

      switch (timeFilter) {
        case "last30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "last6months":
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case "last12months":
          filterDate.setMonth(now.getMonth() - 12);
          break;
        default:
          break;
      }

      result = result.filter((order) => {
        const orderDate = new Date(order.created_at || order.createdAt);
        return orderDate >= filterDate;
      });
    }

    setFilteredOrders(result);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setTimeFilter("all");
    setFilteredOrders(orders);
  };

  const getMockOrders = () => {
    // Generate mock orders for demonstration
    return [
      {
        _id: "ord1001",
        order_id: "ORDER-1001",
        order_type: "product",
        status: "completed",
        total_price: 1450,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product_name: "Muay Thai Training Gloves",
            quantity: 1,
            price_at_order: 1200,
            attributes: { size: "Large", color: "Black" }
          },
          {
            product_name: "Hand Wraps",
            quantity: 2,
            price_at_order: 125,
            attributes: { length: "4m", color: "Red" }
          }
        ],
        shipping_address: {
          receiver_name: user?.first_name + " " + user?.last_name || "John Doe",
          receiver_phone: "0812345678",
          province: "Bangkok",
          district: "Watthana",
          subdistrict: "Khlong Toei Nuea",
          postal_code: "10110"
        }
      },
      {
        _id: "ord1002",
        order_id: "ORDER-1002",
        order_type: "ticket",
        status: "pending",
        total_price: 2500,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product_name: "Bangkok Fight Night Ringside Seat",
            quantity: 1,
            price_at_order: 2500,
            event_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        _id: "ord1003",
        order_id: "ORDER-1003",
        order_type: "course",
        status: "completed",
        total_price: 5000,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product_name: "Beginner Muay Thai Course - 10 Sessions",
            quantity: 1,
            price_at_order: 5000,
            course_dates: "Mon/Wed/Fri, 18:00-19:30"
          }
        ]
      },
      {
        _id: "ord1004",
        order_id: "ORDER-1004",
        order_type: "product",
        status: "shipped",
        total_price: 3200,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product_name: "Muay Thai Shorts",
            quantity: 2,
            price_at_order: 800,
            attributes: { size: "Medium", color: "Blue" }
          },
          {
            product_name: "Competition Gloves",
            quantity: 1,
            price_at_order: 1600,
            attributes: { weight: "8oz", color: "Red/Black" }
          }
        ],
        shipping_address: {
          receiver_name: user?.first_name + " " + user?.last_name || "John Doe",
          receiver_phone: "0812345678",
          province: "Bangkok",
          district: "Watthana",
          subdistrict: "Khlong Toei Nuea",
          postal_code: "10110"
        }
      },
      {
        _id: "ord1005",
        order_id: "ORDER-1005",
        order_type: "ads_package",
        status: "completed",
        total_price: 1999,
        created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product_name: "Premium Event Promotion Package",
            quantity: 1,
            price_at_order: 1999,
            duration: "30 days"
          }
        ]
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-xl shadow text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-text mb-2">{error}</h2>
            <p className="text-text/70 mb-6">
              Please try again later or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text">Your Orders</h1>
          <p className="text-text/70 mt-2">
            View and track all your orders in one place
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-card rounded-xl shadow-sm border border-border/30 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or product name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-text hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
                {(statusFilter !== "all" || typeFilter !== "all" || timeFilter !== "all") && (
                  <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(statusFilter !== "all" ? 1 : 0) +
                      (typeFilter !== "all" ? 1 : 0) +
                      (timeFilter !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>
              {(statusFilter !== "all" || typeFilter !== "all" || timeFilter !== "all" || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-text hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <XMarkIcon className="h-5 w-5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text/70 mb-2">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text/70 mb-2">
                  Order Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Types</option>
                  <option value="product">Products</option>
                  <option value="ticket">Tickets</option>
                  <option value="course">Courses</option>
                  <option value="ads_package">Advertising</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text/70 mb-2">
                  Time Period
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Time</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="last12months">Last 12 Months</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-border/30 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <OrderTypeIcon type={order.order_type} />
                      <span className="font-semibold text-text">
                        {order.order_id || `#${order._id.substr(-6)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-text/70 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(order.created_at || order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-semibold text-text">
                      {formatCurrency(order.total_price)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 py-3">
                  <div className="space-y-2">
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                            {order.order_type === "product" ? (
                              <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                            ) : order.order_type === "ticket" ? (
                              <TicketIcon className="h-6 w-6 text-gray-400" />
                            ) : order.order_type === "course" ? (
                              <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                            ) : (
                              <CalendarIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-text">
                              {item.product_name}
                            </div>
                            <div className="text-sm text-text/70">
                              {item.quantity > 1 ? `${item.quantity} × ` : ""}
                              {formatCurrency(item.price_at_order)}
                              {item.attributes && Object.keys(item.attributes).length > 0 && (
                                <span className="ml-2 text-text/50">
                                  {Object.entries(item.attributes)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")}
                                </span>
                              )}
                            </div>
                            {item.event_date && (
                              <div className="text-xs flex items-center text-text/70 mt-1">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatDate(item.event_date)}
                              </div>
                            )}
                            {item.course_dates && (
                              <div className="text-xs text-text/70 mt-1">
                                {item.course_dates}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-3 border-t border-border/30 bg-background/50 flex justify-between items-center">
                  {order.shipping_address ? (
                    <div className="text-xs text-text/70">
                      Shipping to: {order.shipping_address.receiver_name},{" "}
                      {order.shipping_address.district},{" "}
                      {order.shipping_address.province}
                    </div>
                  ) : (
                    <div className="text-xs text-text/70">
                      {order.order_type === "ticket" ? "Ticket" : "Digital purchase"}
                    </div>
                  )}
                  <Link
                    to={`/user/orders/${order._id}`}
                    className="text-primary hover:text-secondary text-sm flex items-center font-medium"
                  >
                    View Details
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-sm border border-border/30 p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">No orders found</h3>
            <p className="text-text/70 mb-6">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all" || timeFilter !== "all"
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "You haven't placed any orders yet. Start shopping to see your orders here."}
            </p>
            {searchQuery || statusFilter !== "all" || typeFilter !== "all" || timeFilter !== "all" ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/shop"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors inline-block"
              >
                Browse Shop
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;