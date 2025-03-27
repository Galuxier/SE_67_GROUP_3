import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ChartBarIcon, 
  CalendarIcon,
  ClipboardDocumentListIcon,
  FireIcon,
  ChevronDownIcon,
  PlusCircleIcon ,ClockIcon 
} from "@heroicons/react/24/outline";
import { useState } from "react";

const EventManageSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    events: true
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
          to="/event/management"
          className="text-xl font-bold text-primary hover:text-secondary mb-6 flex items-center"
        >
          <FireIcon className="h-6 w-6 mr-2" />
          Event Management
        </Link>

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-1">
          {/* Dashboard */}
          <Link
            to="/event/management/dashboard"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <ChartBarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Dashboard
          </Link>

          {/* Events Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu('events')}
              className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                isActive("/events") ? "bg-primary/10 text-primary font-medium" : "text-text"
              } flex items-center justify-between group transition-colors`}
            >
              <div className="flex items-center">
                <FireIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                My Events
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.events ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.events && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/event/management/eventlist"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/event/manage/events" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  All Events
                </Link>
                <Link
                  to="/event/management/create"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/event/manage/events/create" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  <div className="flex items-center">
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Create Event
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Schedule */}
          <Link
            to="/event/management/onGoing"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/onGoing") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <ClockIcon    className="h-5 w-5 mr-3 group-hover:text-primary" />
            On Going
          </Link>

          {/* Schedule */}
          <Link
            to="/event/manage/schedule"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/schedule") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <CalendarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Schedule
          </Link>

          {/* Reports */}
          <Link
            to="/event/manage/reports"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/reports") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Reports
          </Link>
          <Link
            to="/event/management/eventPackage"
            className="p-2 rounded-md hover:bg-primary hover:text-white text-text"
          >
            Event Package
          </Link>
        </nav>

        {/* Bottom section with return link */}
        <div className="mt-auto pt-6 border-t border-border">
          <Link
            to="/event"
            className="text-text hover:text-primary text-sm flex items-center"
          >
            ← Return to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventManageSidebar;