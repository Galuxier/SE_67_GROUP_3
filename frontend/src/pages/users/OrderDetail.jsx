/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShoppingBagIcon,
  TicketIcon,
  AcademicCapIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getUserOrders } from "../../services/api/OrderApi";
import { getImage } from "../../services/api/ImageApi";

// Helper components
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

const OrderTypeIcon = ({ type, size = "md" }) => {
  const iconSize = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  
  switch (type?.toLowerCase()) {
    case "product":
      return <ShoppingBagIcon className={`${iconSize} text-indigo-500`} />;
    case "ticket":
      return <TicketIcon className={`${iconSize} text-purple-500`} />;
    case "course":
      return <AcademicCapIcon className={`${iconSize} text-blue-500`} />;
    case "ads_package":
      return <CalendarIcon className={`${iconSize} text-amber-500`} />;
    default:
      return <ShoppingBagIcon className={`${iconSize} text-gray-500`} />;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "PPP", { locale: th });
  } catch (error) {
    return "Invalid date";
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "PPp", { locale: th });
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

// Tracking steps for product orders
const trackingSteps = [
  { title: "Order Placed", description: "We've received your order" },
  { title: "Processing", description: "Preparing your items" },
  { title: "Shipped", description: "Your order is on the way" },
  { title: "Delivered", description: "Package delivered" },
];

// Main component
const OrderDetail = () => {
  const { order_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemImages, setItemImages] = useState({});

  const getOrderStepStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !user._id) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // In production, you'd want to call a specific API endpoint for order details
        // For now, we'll get all orders and find the one we need
        const response = await getUserOrders(user._id);
        
        // For demo purposes - when API is not connected, use mock data
        let orders = [];
        if (response?.data?.length > 0) {
          orders = response.data;
        } else {
          // Use mock data for demonstration
          orders = getMockOrders();
        }
        
        const foundOrder = orders.find(o => o._id === order_id);
        
        if (!foundOrder) {
          setError("Order not found");
          setIsLoading(false);
          return;
        }
        
        setOrder(foundOrder);
        
        // Try loading images for product items
        if (foundOrder.order_type === "product" && foundOrder.items) {
          const imagePromises = foundOrder.items.map(async (item) => {
            if (item.image_url) {
              try {
                const imageData = await getImage(item.image_url);
                return { id: item._id || index, url: imageData };
              } catch (err) {
                console.error("Failed to load image:", err);
                return { id: item._id || index, url: null };
              }
            }
            return { id: item._id || index, url: null };
          });
          
          const images = await Promise.all(imagePromises);
          const imageMap = {};
          images.forEach(img => {
            if (img.url) {
              imageMap[img.id] = img.url;
            }
          });
          
          setItemImages(imageMap);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, order_id]);

  const getMockOrders = () => {
    // Simplified mock orders for demonstration
    return [
      {
        _id: "ord1001",
        order_id: "ORDER-1001",
        order_type: "product",
        status: "shipped",
        total_price: 1450,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Credit Card",
        payment_info: {
          last4: "4242",
          brand: "Visa",
          payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        tracking_number: "TH12345678901",
        shipping_service: "Thailand Post EMS",
        shipping_cost: 50,
        estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            _id: "item1",
            product_name: "Muay Thai Training Gloves",
            quantity: 1,
            price_at_order: 1200,
            attributes: { size: "Large", color: "Black" }
          },
          {
            _id: "item2",
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
          postal_code: "10110",
          information: "Building A, Room 123"
        },
        status_history: [
          { status: "pending", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: "Order received" },
          { status: "processing", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: "Payment confirmed" },
          { status: "shipped", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: "Package shipped via Thailand Post EMS" }
        ]
      },
      {
        _id: "ord1002",
        order_id: "ORDER-1002",
        order_type: "ticket",
        status: "completed",
        total_price: 2500,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Prompt Pay",
        payment_info: {
          transaction_id: "PP7890123456",
          payment_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        items: [
          {
            _id: "ticket1",
            product_name: "Bangkok Fight Night Ringside Seat",
            quantity: 1,
            price_at_order: 2500,
            event_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            event_location: "Lumpinee Boxing Stadium, Bangkok",
            seat_info: "Ringside, Section A, Row 2, Seat 15",
            ticket_code: "TKT-BFN-A215"
          }
        ],
        status_history: [
          { status: "pending", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), note: "Ticket reservation" },
          { status: "processing", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), note: "Payment confirmed" },
          { status: "completed", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), note: "E-ticket issued" }
        ]
      },
      {
        _id: "ord1003",
        order_id: "ORDER-1003",
        order_type: "course",
        status: "completed",
        total_price: 5000,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Bank Transfer",
        payment_info: {
          bank: "Kasikorn Bank",
          transaction_id: "KB123456789",
          payment_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        items: [
          {
            _id: "course1",
            product_name: "Beginner Muay Thai Course - 10 Sessions",
            quantity: 1,
            price_at_order: 5000,
            course_id: "C1001",
            course_start: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            course_end: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            course_schedule: "Mon/Wed/Fri, 18:00-19:30",
            course_location: "Bangkok Fight Club",
            trainer: "Trainer Somchai"
          }
        ],
        status_history: [
          { status: "pending", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), note: "Course registration" },
          { status: "processing", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), note: "Payment confirmed" },
          { status: "completed", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), note: "Course completed" }
        ]
      },
      {
        _id: "ord1005",
        order_id: "ORDER-1005",
        order_type: "ads_package",
        status: "completed",
        total_price: 1999,
        created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: "Credit Card",
        payment_info: {
          last4: "1234",
          brand: "Mastercard",
          payment_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
        },
        items: [
          {
            _id: "ads1",
            product_name: "Premium Event Promotion Package",
            quantity: 1,
            price_at_order: 1999,
            package_id: "PKG1001",
            package_start: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            package_end: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            duration: "30 days",
            promoted_event: "Bangkok Fight Night",
            features: ["Homepage Banner", "Featured Listing", "Email Newsletter", "Social Media Promotion"]
          }
        ],
        status_history: [
          { status: "pending", timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), note: "Package selected" },
          { status: "processing", timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), note: "Payment confirmed" },
          { status: "completed", timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), note: "Promotion period ended" }
        ]
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-xl shadow text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-text mb-2">{error || "Order not found"}</h2>
            <p className="text-text/70 mb-6">
              The order you're looking for couldn't be found or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate("/user/orders")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/user/orders")}
          className="inline-flex items-center mb-6 text-primary hover:text-secondary transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-card rounded-xl shadow-sm border border-border/30 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <OrderTypeIcon type={order.order_type} size="lg" />
                <h1 className="text-2xl font-bold text-text">
                  {order.order_id || `Order #${order._id.substr(-6)}`}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text/70">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {formatDateTime(order.created_at || order.createdAt)}
                  </span>
                </div>
                {order.payment_method && (
                  <div className="text-sm">
                    <span className="font-medium">Payment:</span> {order.payment_method}
                  </div>
                )}
                {order.tracking_number && (
                  <div className="text-sm">
                    <span className="font-medium">Tracking:</span> {order.tracking_number}
                  </div>
                )}
              </div>
            </div>
            <div className="font-semibold text-lg text-text flex items-baseline gap-1">
              <span className="text-sm font-normal text-text/70 mr-1">Total:</span>
              {formatCurrency(order.total_price)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content (items and details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
              <div className="p-4 border-b border-border/30 bg-background/50">
                <h2 className="font-semibold text-text">Order Items</h2>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={item._id || index} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                        {itemImages[item._id] ? (
                          <img 
                            src={itemImages[item._id]} 
                            alt={item.product_name} 
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <OrderTypeIcon type={order.order_type} />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-text">{item.product_name}</h3>
                          <span className="font-medium text-text">
                            {formatCurrency(item.price_at_order * item.quantity)}
                          </span>
                        </div>
                        <div className="text-sm text-text/70">
                          {item.quantity > 1 ? `${item.quantity} × ${formatCurrency(item.price_at_order)}` : formatCurrency(item.price_at_order)}
                        </div>
                        
                        {/* Display attributes if available */}
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                          <div className="mt-1 text-sm text-text/70">
                            {Object.entries(item.attributes).map(([key, value], i) => (
                              <span key={i}>
                                {key}: <span className="font-medium text-text/80">{value}</span>
                                {i < Object.entries(item.attributes).length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Order type specific details */}
                        {order.order_type === "ticket" && item.event_date && (
                          <div className="mt-2 text-sm">
                            <div className="flex items-center text-text/70">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                              {formatDate(item.event_date)}
                            </div>
                            {item.event_location && (
                              <div className="flex items-center text-text/70 mt-1">
                                <MapPinIcon className="h-3.5 w-3.5 mr-1.5" />
                                {item.event_location}
                              </div>
                            )}
                            {item.seat_info && (
                              <div className="mt-1 py-1 px-2 bg-primary/10 text-primary rounded text-xs inline-block">
                                {item.seat_info}
                              </div>
                            )}
                            {item.ticket_code && (
                              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-center font-mono">
                                {item.ticket_code}
                              </div>
                            )}
                          </div>
                        )}

                        {order.order_type === "course" && (
                          <div className="mt-2 text-sm">
                            {item.course_schedule && (
                              <div className="flex items-center text-text/70">
                                <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                                {item.course_schedule}
                              </div>
                            )}
                            {item.course_location && (
                              <div className="flex items-center text-text/70 mt-1">
                                <MapPinIcon className="h-3.5 w-3.5 mr-1.5" />
                                {item.course_location}
                              </div>
                            )}
                            {item.course_start && item.course_end && (
                              <div className="flex items-center text-text/70 mt-1">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                {formatDate(item.course_start)} - {formatDate(item.course_end)}
                              </div>
                            )}
                            {item.trainer && (
                              <div className="mt-1 text-text/70">
                                Trainer: <span className="font-medium text-text/80">{item.trainer}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {order.order_type === "ads_package" && (
                          <div className="mt-2 text-sm">
                            {item.duration && (
                              <div className="text-text/70">
                                Duration: <span className="font-medium text-text/80">{item.duration}</span>
                              </div>
                            )}
                            {item.package_start && item.package_end && (
                              <div className="flex items-center text-text/70 mt-1">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                {formatDate(item.package_start)} - {formatDate(item.package_end)}
                              </div>
                            )}
                            {item.promoted_event && (
                              <div className="mt-1 text-text/70">
                                Promoted: <span className="font-medium text-text/80">{item.promoted_event}</span>
                              </div>
                            )}
                            {item.features && item.features.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs text-text/70 mb-1">Features:</div>
                                <div className="flex flex-wrap gap-1">
                                  {item.features.map((feature, i) => (
                                    <span key={i} className="text-xs py-0.5 px-2 bg-gray-100 dark:bg-gray-800 rounded">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order tracking for product orders */}
            {order.order_type === "product" && (
              <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
                <div className="p-4 border-b border-border/30 bg-background/50">
                  <h2 className="font-semibold text-text">Order Tracking</h2>
                </div>

                <div className="p-4">
                  {/* Tracking info */}
                  {order.tracking_number && (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="text-sm text-text/70">Tracking Number</div>
                        <div className="font-medium text-text">{order.tracking_number}</div>
                      </div>
                      {order.shipping_service && (
                        <div>
                          <div className="text-sm text-text/70">Shipping Service</div>
                          <div className="font-medium text-text">{order.shipping_service}</div>
                        </div>
                      )}
                      {order.estimated_delivery && (
                        <div>
                          <div className="text-sm text-text/70">Estimated Delivery</div>
                          <div className="font-medium text-text">{formatDate(order.estimated_delivery)}</div>
                        </div>
                      )}
                      <a 
                        href="#" 
                        className="text-primary hover:text-secondary text-sm font-medium md:self-center"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("This would open the carrier's tracking page");
                        }}
                      >
                        Track Package
                      </a>
                    </div>
                  )}

                  {/* Tracking steps */}
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    {trackingSteps.map((step, index) => {
                      const currentStep = getOrderStepStatus(order.status);
                      const isComplete = index <= currentStep;
                      const isCurrent = index === currentStep;
                      
                      return (
                        <div key={index} className="relative flex items-start gap-4 pb-8">
                          <div
                            className={`z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                              isComplete 
                                ? "bg-primary text-white" 
                                : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                            }`}
                          >
                            {index === 0 ? (
                              <ShoppingBagIcon className="w-6 h-6" />
                            ) : index === 1 ? (
                              <ClockIcon className="w-6 h-6" />
                            ) : index === 2 ? (
                              <TruckIcon className="w-6 h-6" />
                            ) : (
                              <MapPinIcon className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${isComplete ? "text-text" : "text-text/70"}`}>
                              {step.title}
                              {isCurrent && <span className="ml-2 text-primary">(Current)</span>}
                            </h3>
                            <p className="text-sm text-text/70">{step.description}</p>
                            
                            {/* Find matching status history entry */}
                            {order.status_history && isComplete && 
                              order.status_history
                                .filter(history => {
                                  if (index === 0) return history.status === "pending";
                                  if (index === 1) return history.status === "processing";
                                  if (index === 2) return history.status === "shipped";
                                  if (index === 3) return history.status === "completed";
                                  return false;
                                })
                                .map((history, i) => (
                                  <div key={i} className="mt-1">
                                    <div className="text-xs text-text/70">{formatDateTime(history.timestamp)}</div>
                                    {history.note && <div className="text-sm text-text/90 mt-0.5">{history.note}</div>}
                                  </div>
                                ))
                            }
                          </div>
                        </div>
                      );
                    })}
                    </div>
                </div>
              </div>
            )}

            {/* Status history for other order types */}
            {order.order_type !== "product" && order.status_history && order.status_history.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
                <div className="p-4 border-b border-border/30 bg-background/50">
                  <h2 className="font-semibold text-text">Order Status History</h2>
                </div>

                <div className="p-4">
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    {order.status_history.map((history, index) => (
                      <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0">
                        <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                          index === 0 ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}>
                          {history.status === "pending" ? (
                            <ClockIcon className="w-6 h-6" />
                          ) : history.status === "processing" ? (
                            <ShoppingBagIcon className="w-6 h-6" />
                          ) : history.status === "completed" ? (
                            <CheckIcon className="w-6 h-6" />
                          ) : (
                            <InformationCircleIcon className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-text capitalize">
                            {history.status.replace('_', ' ')}
                          </h3>
                          <div className="text-xs text-text/70">{formatDateTime(history.timestamp)}</div>
                          {history.note && <div className="text-sm text-text/90 mt-1">{history.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (summary and shipping info) */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
              <div className="p-4 border-b border-border/30 bg-background/50">
                <h2 className="font-semibold text-text">Order Summary</h2>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-text/80">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.total_price - (order.shipping_cost || 0))}</span>
                  </div>
                  {order.shipping_cost > 0 && (
                    <div className="flex justify-between text-text/80">
                      <span>Shipping</span>
                      <span>{formatCurrency(order.shipping_cost)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between text-text/80">
                      <span>Tax</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-border/30">
                    <div className="flex justify-between font-medium text-text">
                      <span>Total</span>
                      <span>{formatCurrency(order.total_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment info */}
                {order.payment_info && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <h3 className="font-medium text-text mb-2">Payment Information</h3>
                    <div className="text-sm text-text/80 space-y-1">
                      {order.payment_method && (
                        <div className="flex justify-between">
                          <span>Method</span>
                          <span>{order.payment_method}</span>
                        </div>
                      )}
                      {order.payment_info.last4 && (
                        <div className="flex justify-between">
                          <span>Card</span>
                          <span>{order.payment_info.brand} •••• {order.payment_info.last4}</span>
                        </div>
                      )}
                      {order.payment_info.transaction_id && (
                        <div className="flex justify-between">
                          <span>Transaction ID</span>
                          <span className="font-mono text-xs">{order.payment_info.transaction_id}</span>
                        </div>
                      )}
                      {order.payment_info.payment_date && (
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span>{formatDate(order.payment_info.payment_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address (for product orders) */}
            {order.order_type === "product" && order.shipping_address && (
              <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
                <div className="p-4 border-b border-border/30 bg-background/50">
                  <h2 className="font-semibold text-text">Shipping Address</h2>
                </div>

                <div className="p-4">
                  <div className="text-text">
                    <div className="font-medium">{order.shipping_address.receiver_name}</div>
                    <div className="mt-1 text-text/80">
                      {order.shipping_address.information && (
                        <div>{order.shipping_address.information}</div>
                      )}
                      <div>
                        {order.shipping_address.subdistrict}, {order.shipping_address.district}
                      </div>
                      <div>
                        {order.shipping_address.province} {order.shipping_address.postal_code}
                      </div>
                    </div>
                    {order.shipping_address.receiver_phone && (
                      <div className="mt-2 flex items-center text-text/80">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {order.shipping_address.receiver_phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Support section */}
            <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
              <div className="p-4 border-b border-border/30 bg-background/50">
                <h2 className="font-semibold text-text">Need Help?</h2>
              </div>
              <div className="p-4">
                <div className="text-text/80 text-sm space-y-4">
                  <p>
                    If you have questions about your order or need assistance, our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <Link to="/contact" className="text-primary hover:text-secondary flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      Contact Support
                    </Link>
                    {order.order_type === "product" && order.status !== "cancelled" && (
                      <button 
                        className="text-primary hover:text-secondary flex items-center"
                        onClick={() => {
                          alert("In a real application, this would open a return/refund request form");
                        }}
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Request Return or Refund
                      </button>
                    )}
                    {(order.order_type === "ticket" || order.order_type === "course") && order.status === "pending" && (
                      <button 
                        className="text-primary hover:text-secondary flex items-center"
                        onClick={() => {
                          alert("In a real application, this would open a cancellation confirmation dialog");
                        }}
                      >
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Don't forget to import the icons used in the code
import { 
  CheckIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowPathIcon, 
  XCircleIcon,
  InformationCircleIcon 
} from "@heroicons/react/24/outline";

export default OrderDetail;