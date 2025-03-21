// ShopManageLayout.jsx - ปรับขนาด sidebar
import { Outlet } from "react-router-dom";
import ShopManageSidebar from "../components/sidebars/ShopManageSidebar";
import ManagementNavbar from "../components/navbar/ManagementNavbar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ShopManageLayout = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { shopId } = useParams();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [userShops, setUserShops] = useState([]);

  // Verify user has permission to access shop management
  useEffect(() => {
    const fetchUserShops = async () => {
      try {
        // จำลองการดึงข้อมูลร้านค้าทั้งหมดของผู้ใช้
        setTimeout(() => {
          const shops = [
            {
              _id: "shop1",
              shop_name: "Main Shop",
            },
            {
              _id: "shop2",
              shop_name: "Second Shop",
            }
          ];
          
          setUserShops(shops);
          
          if (shopId) {
            const selectedShop = shops.find(shop => shop._id === shopId);
            if (selectedShop) {
              setShopData(selectedShop);
            } else {
              setShopData(shops[0]);
            }
          } else {
            setShopData(shops[0]);
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setLoading(false);
      }
    };

    if (isLoggedIn && user) {
      if (user.role && user.role.includes('shop_owner')) {
        fetchUserShops();
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate, shopId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <ShopManageSidebar 
        shopData={shopData} 
        userShops={userShops}
      />

      {/* Main Content - ปรับ margin-left ให้สอดคล้องกับขนาด sidebar ใหม่ */}
      <div className="flex-1 ml-56">
        {/* Navbar */}
        <ManagementNavbar />

        {/* Page Content */}
        <div className="p-4 mt-6">
          <Outlet context={{ shopData, userShops }} />
        </div>
      </div>
    </div>
  );
};

export default ShopManageLayout;