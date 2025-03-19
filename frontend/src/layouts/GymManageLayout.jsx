import { Outlet } from "react-router-dom";
import GymManageSidebar from "../components/sidebars/GymManageSidebar";
import ManagementNavBar from "../components/navbar/ManagementNavbar";

const GymManageLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <GymManageSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <ManagementNavBar />

        {/* Page Content */}
        <div className="p-4 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default GymManageLayout;