import { Link } from "react-router-dom";
import { HomeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const PlaceManageSidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 p-4 bg-bar border-r border-border">
      <div className="flex flex-col space-y-4">
        {/* Logo or Home Button */}
        <Link
          to="/place/management"
          className="text-xl font-bold text-primary hover:text-secondary"
        >
          Place Management
        </Link>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-2 mt-6">
          <Link
            to="/place/management"
            className="p-2 rounded-md hover:bg-primary hover:text-white text-text flex items-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Home
          </Link>
          <Link
            to="/place/manage/dashboard"
            className="p-2 rounded-md hover:bg-primary hover:text-white text-text flex items-center"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
        </nav>

        {/* Divider */}
        <hr className="border-border my-4" />

        {/* Return to main site */}
        <Link
          to="/"
          className="text-text hover:text-primary text-sm"
        >
          ← Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PlaceManageSidebar;