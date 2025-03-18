import { Outlet } from "react-router-dom";
import PlaceManageSidebar from "../components/sidebars/PlaceManageSidebar";
import AdminNavbar from "../components/navbar/ManagementNavbar";

const PlaceManageLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <PlaceManageSidebar />

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

export default PlaceManageLayout;