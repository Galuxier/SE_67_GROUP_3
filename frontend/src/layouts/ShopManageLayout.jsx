import { Outlet } from "react-router-dom";
import ShopManageSidebar from "../components/sidebars/ShopManageSidebar";
import ManagementNavbar from "../components/navbar/ManagementNavbar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { getUserShops, getShopById } from "../services/api/ShopApi";
import { useAuth } from "../context/AuthContext";

const ShopManageLayout = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [userShops, setUserShops] = useState([]);
  const [error, setError] = useState(null);

  const isAddShopPage = window.location.pathname === "/shop/management/addShop";

  // Fetch shop data only on initial load or when explicitly needed
  const fetchShopData = useCallback(async () => {
    if (!user || !user._id) {
      setError("User session not found. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const shopsResponse = await getUserShops(user._id);
      const ownedShops = shopsResponse.data || [];
      setUserShops(ownedShops);

      if (ownedShops.length === 0 && !isAddShopPage) {
        navigate("/shop/management/addShop", { replace: true });
        return;
      }

      // Load shop data only if shopId exists and user owns it
      if (shopId) {
        const userOwnsShop = ownedShops.some((shop) => shop._id === shopId);
        if (!userOwnsShop) {
          setShopData(ownedShops[0]);
          navigate(`/shop/management/${ownedShops[0]._id}`, { replace: true });
          toast.error("Access denied. Redirected to your default shop.");
          return;
        }
        const shopResponse = await getShopById(shopId);
        setShopData(shopResponse);
      } else if (!isAddShopPage && ownedShops.length > 0) {
        setShopData(ownedShops[0]);
        navigate(`/shop/management/${ownedShops[0]._id}`, { replace: true });
      }
    } catch (err) {
      console.error("Error fetching shop data:", err);
      setError("Failed to load shop data. Please try again.");
      toast.error("Failed to load shop data.");
    } finally {
      setLoading(false);
    }
  }, [user, isAddShopPage, navigate]); // Remove shopId from dependencies

  // Initial data fetch only
  useEffect(() => {
    if (!shopData && !isAddShopPage) {
      fetchShopData();
    }
  }, [fetchShopData, shopData, isAddShopPage]);

  // Handle shop switching without full page reload
  const handleSwitchShop = useCallback(
    async (newShopId) => {
      if (newShopId === shopData?._id) return;

      setLoading(true);
      try {
        const shopExists = userShops.some((shop) => shop._id === newShopId);
        if (!shopExists) {
          throw new Error("Shop not found or access denied.");
        }
        const shopDetails = await getShopById(newShopId);
        setShopData(shopDetails);
        navigate(`/shop/management/${newShopId}`, { replace: true });
      } catch (err) {
        console.error("Error switching shop:", err);
        toast.error("Failed to switch shop. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [shopData, userShops, navigate]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !isAddShopPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center p-8 max-w-md">
          <div className="text-5xl text-primary mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <button
            onClick={() => navigate("/shop")}
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
      {!isAddShopPage && (
        <ShopManageSidebar
          shopData={shopData}
          userShops={userShops}
          onSwitchShop={handleSwitchShop}
        />
      )}
      <div className={`flex-1 ${!isAddShopPage ? "ml-64" : ""}`}>
        {!isAddShopPage && <ManagementNavbar />}
        <div className={`p-4 ${!isAddShopPage ? "mt-6" : ""} bg-background`}>
          <Outlet context={{ shopData, userShops, switchShop: handleSwitchShop }} />
        </div>
      </div>
    </div>
  );
};

export default ShopManageLayout;