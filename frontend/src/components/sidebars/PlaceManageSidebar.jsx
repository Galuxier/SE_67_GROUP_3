import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ChartBarIcon, 
  MapPinIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

const PlaceManageSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    places: true
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Check if the current path includes the given path
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 p-4 bg-bar border-r border-border overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Header */}
        <Link
          to="/place/management"
          className="text-xl font-bold text-primary hover:text-secondary mb-6 flex items-center"
        >
          <MapPinIcon className="h-6 w-6 mr-2" />
          Place Management
        </Link>

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-1">
          {/* Dashboard */}
          <Link
            to="/place/management/dashboard"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <ChartBarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Dashboard
          </Link>

          {/* Places Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu('places')}
              className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                isActive("/places") ? "bg-primary/10 text-primary font-medium" : "text-text"
              } flex items-center justify-between group transition-colors`}
            >
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                My Places
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.places ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.places && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/place/management/placelist"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/place/manage/places" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  All Places
                </Link>
                <Link
                  to="/place/management/create"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/place/manage/places/create" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  <div className="flex items-center">
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Add New Place
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Schedule */}
          <Link
            to="/place/manage/schedule"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/schedule") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <CalendarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Schedule
          </Link>

          {/* Reports */}
          <Link
            to="/place/manage/reports"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/reports") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Reports
          </Link>
        </nav>

        {/* Bottom section with return link */}
        <div className="mt-auto pt-6 border-t border-border">
          <Link
            to="/"
            className="text-text hover:text-primary text-sm flex items-center"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceManageSidebar;