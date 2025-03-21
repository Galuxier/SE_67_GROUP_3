import { Outlet } from "react-router-dom";
import ShopManageSidebar from "../components/sidebars/ShopManageSidebar";
import ManagementNavbar from "../components/navbar/ManagementNavbar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ShopManageLayout = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);

  // Verify user has permission to access shop management
  useEffect(() => {
    const checkAccess = () => {
      // Simulate fetching shop data
      setTimeout(() => {
        setShopData({
          _id: "shop1",
          shop_name: "Your Shop",
          // Other shop data...
        });
        setLoading(false);
      }, 500);
    };

    checkAccess();
  }, [isLoggedIn, user, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <ShopManageSidebar shopData={shopData} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <ManagementNavbar />

        {/* Page Content */}
        <div className="p-6 mt-6">
          <Outlet context={{ shopData }} />
        </div>
      </div>
    </div>
  );
};

export default ShopManageLayout;