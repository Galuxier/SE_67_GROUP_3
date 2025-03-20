import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/sidebars/AdminSidebar";
import AdminNavbar from "../components/navbar/ManagementNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;