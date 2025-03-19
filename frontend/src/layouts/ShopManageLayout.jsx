import { Outlet } from "react-router-dom";
import ShopManageSidebar from "../components/sidebars/ShopManageSidebar";
import AdminNavbar from "../components/navbar/ManagementNavbar";

const ShopManageLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <ShopManageSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="p-4 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ShopManageLayout;