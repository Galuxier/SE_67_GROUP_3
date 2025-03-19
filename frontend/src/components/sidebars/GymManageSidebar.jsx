import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ChartBarIcon, 
  AcademicCapIcon, 
  BuildingStorefrontIcon,
  UsersIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

const GymManageSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    gyms: true,
    courses: false
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
          to="/gym/management"
          className="text-xl font-bold text-primary hover:text-secondary mb-6 flex items-center"
        >
          <BuildingStorefrontIcon className="h-6 w-6 mr-2" />
          Gym Management
        </Link>

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-1">
          {/* Dashboard */}
          <Link
            to="/gym/management/dashboard"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <ChartBarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Dashboard
          </Link>

          {/* Gyms Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu('gyms')}
              className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                isActive("/gyms") ? "bg-primary/10 text-primary font-medium" : "text-text"
              } flex items-center justify-between group transition-colors`}
            >
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                My Gyms
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.gyms ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.gyms && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/gym/management/gymlist"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/gym/manage/gyms" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  All Gyms
                </Link>
                <Link
                  to="/gym/management/create"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/gym/manage/gyms/create" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  <div className="flex items-center">
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Add New Gym
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Courses Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleMenu('courses')}
              className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                isActive("/courses") ? "bg-primary/10 text-primary font-medium" : "text-text"
              } flex items-center justify-between group transition-colors`}
            >
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                Courses
              </div>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedMenus.courses ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedMenus.courses && (
              <div className="pl-10 space-y-1">
                <Link
                  to="/gym/manage/courses/active"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/gym/manage/courses/active" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Active Courses
                </Link>
                <Link
                  to="/gym/manage/courses/completed"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/gym/manage/courses/completed" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  Completed Courses
                </Link>
                <Link
                  to="/gym/manage/courses/create"
                  className={`block p-2 rounded-md hover:bg-primary/10 ${
                    location.pathname === "/gym/manage/courses/create" ? "text-primary" : "text-text"
                  } text-sm transition-colors`}
                >
                  <div className="flex items-center">
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Create Course
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Members/Trainers */}
          <Link
            to="/gym/manage/members"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/members") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <UsersIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Members & Trainers
          </Link>

          {/* Schedule */}
          <Link
            to="/gym/manage/schedule"
            className={`p-2 rounded-md hover:bg-primary/10 ${
              isActive("/schedule") ? "bg-primary/10 text-primary font-medium" : "text-text"
            } flex items-center group transition-colors`}
          >
            <CalendarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
            Schedule
          </Link>

          {/* Reports */}
          <Link
            to="/gym/manage/reports"
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
            to="/gym"
            className="text-text hover:text-primary text-sm flex items-center"
          >
            ← Return to Gyms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GymManageSidebar;