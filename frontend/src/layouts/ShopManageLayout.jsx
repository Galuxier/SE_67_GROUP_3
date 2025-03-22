import { Outlet } from "react-router-dom";
import ShopManageSidebar from "../components/sidebars/ShopManageSidebar";
import ManagementNavbar from "../components/navbar/ManagementNavbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { getUserShops, getShopById } from "../services/api/ShopApi";
import { useAuth } from "../context/AuthContext";

const ShopManageLayout = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [userShops, setUserShops] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  

  // Check if we're on the addShop page
  const isAddShopPage = location.pathname.includes('/management/addShop');

  // Fetch user's shops and current shop data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user's shops
        const shopsResponse = await getUserShops(user._id);
        const shops = shopsResponse || [];
        setUserShops(shops);
        
        if (shops.length > 0) {
          // If shopId is provided in URL, fetch that specific shop
          if (shopId) {
            try {
              const shopResponse = await getShopById(shopId);
              setShopData(shopResponse);
            } catch (shopError) {
              console.error("Error fetching specific shop:", shopError);
              // If specific shop fetch fails, default to first shop
              setShopData(shops[0]);
              navigate(`/shop/management/${shops[0]._id}`, { replace: true });
            }
          } else if (!isAddShopPage) {
            // If no shop specified and not on addShop page, use first shop
            setShopData(shops[0]);
            navigate(`/shop/management/${shops[0]._id}`, { replace: true });
          }
        } else if (!isAddShopPage) {
          // No shops found and not on addShop page, redirect to shop creation
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

    fetchData();
  }, [navigate, shopId, isAddShopPage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Special case: When on addShop page with no shops, still render the layout without error
  if (error && !isAddShopPage) {
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