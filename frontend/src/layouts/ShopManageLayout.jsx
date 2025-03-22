import { Outlet } from "react-router-dom";
import ShopManageSidebar from "../components/sidebars/ShopManageSidebar";
import ManagementNavbar from "../components/navbar/ManagementNavbar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const ShopManageLayout = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { shopId } = useParams();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [userShops, setUserShops] = useState([]);
  const [error, setError] = useState(null);

  // Fetch user's shops
  useEffect(() => {
    const fetchUserShops = async () => {
      try {
        setLoading(true);
        
        // In a production environment, replace with actual API call
        // Example: const response = await api.get('/shops/user');
        
        // Simulating API request with a delay
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            // Check if we have shops in localStorage for demo purposes
            const savedShops = localStorage.getItem('userShops');
            
            if (savedShops) {
              resolve({ data: JSON.parse(savedShops) });
            } else {
              // If no saved data, return empty array
              resolve({ data: [] });
            }
          }, 500);
        });
        
        if (response.data && response.data.length > 0) {
          setUserShops(response.data);
          
          // Set active shop data
          if (shopId) {
            const selectedShop = response.data.find(shop => shop._id === shopId);
            if (selectedShop) {
              setShopData(selectedShop);
            } else {
              // If specified shop not found, use first shop
              setShopData(response.data[0]);
              // Redirect to first shop if specific shop not found
              navigate(`/shop/management/${response.data[0]._id}`, { replace: true });
            }
          } else {
            // If no shop specified, use first shop
            setShopData(response.data[0]);
            // Redirect to first shop
            navigate(`/shop/management/${response.data[0]._id}`, { replace: true });
          }
        } else {
          // No shops found, redirect to shop creation
          setError("You don't have any shops yet. Create your first shop to continue.");
          navigate("/shop/management/addShop");
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setError("Failed to load your shops. Please try again later.");
        toast.error("Failed to load shop data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if user is logged in and has shop_owner role
    if (isLoggedIn && user) {
      if (user.role && user.role.includes('shop_owner')) {
        fetchUserShops();
      } else {
        setError("You don't have permission to access shop management.");
        navigate('/');
      }
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoggedIn, user, navigate, shopId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center p-8 max-w-md">
          <div className="text-5xl text-primary mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <button 
            onClick={() => navigate('/shop')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors mt-4"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <ShopManageSidebar 
        shopData={shopData} 
        userShops={userShops}
      />

      {/* Main Content */}
      <div className="flex-1 ml-56">
        {/* Navbar */}
        <ManagementNavbar />

        {/* Page Content */}
        <div className="p-4 mt-6 bg-background">
          <Outlet context={{ shopData, userShops }} />
        </div>
      </div>
    </div>
  );
};

export default ShopManageLayout;