import { Outlet } from "react-router-dom";
import EventManageSidebar from "../components/sidebars/EventManageSidebar";
import AdminNavbar from "../components/navbar/ManagementNavbar";

const EventManageLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <EventManageSidebar />

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

export default EventManageLayout;