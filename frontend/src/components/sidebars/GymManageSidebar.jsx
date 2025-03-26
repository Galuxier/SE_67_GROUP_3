/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const GymManageSidebar = ({ gymData, userGyms = [], onSwitchGym }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    gyms: userGyms.length > 1, // Auto-expand gyms menu if user has multiple gyms
    courses: true,
    boxers: false,
    trainers: false,
  });

  // Local state for gym switcher modal
  const [showGymSwitcher, setShowGymSwitcher] = useState(false);

  // Check if the current path includes the given path
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Toggle menu expansion
  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Handle gym change
  const handleGymChange = (gymId) => {
    if (onSwitchGym) {
      onSwitchGym(gymId);
    } else {
      navigate(`/gym/management/${gymId}`);
    }
    setShowGymSwitcher(false);
  };

  // Determine if multiple gyms section should be shown
  const showMultipleGyms = userGyms && userGyms.length > 0;

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 p-4 bg-bar border-r border-border overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Current Gym Header */}
          <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-border/50">
            {gymData ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  {gymData.gym_image_url && gymData.gym_image_url.length > 0 ? (
                    <img
                      src={gymData.gym_image_url[0]}
                      alt={gymData.gym_name}
                      className="h-8 w-8 rounded-full object-cover border border-border/50"
                    />
                  ) : (
                    <div className="bg-primary/20 rounded-full p-1 h-8 w-8 flex items-center justify-center">
                      <BuildingStorefrontIcon className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="truncate">
                    <h2 className="text-sm font-bold text-text truncate">
                      {gymData.gym_name || "Gym Manager"}
                    </h2>
                  </div>
                </div>

                {userGyms.length > 1 && (
                  <button
                    onClick={() => setShowGymSwitcher(true)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text/70 hover:text-primary transition-colors"
                    title="Switch Gym"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded p-1">
                  <BuildingStorefrontIcon className="h-4 w-4 text-white" />
                </div>
                <div className="truncate">
                  <h2 className="text-sm font-bold text-text">Gym Manager</h2>
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-col space-y-1">
            {/* Dashboard */}
            <Link
              to={
                gymData
                  ? `/gym/management/${gymData._id}`
                  : `gym/management/create`
              }
              className={`p-2 rounded-md hover:bg-primary/10 ${
                isActive("/dashboard")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text"
              } flex items-center group transition-colors`}
            >
              <ChartBarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
              Dashboard
            </Link>

            {/* Gyms Section */}

            <Link
              to={
                gymData
                  ? `/gym/management/${gymData._id}/edit`
                  : `gym/management/create`
              }
              className={`block p-2 rounded-md hover:bg-primary/10 ${
                location.pathname === "/gym/management/edit"
                  ? "text-primary"
                  : "text-text"
              } flex text-sm transition-colors`}
            >
              <BuildingStorefrontIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
              My Gym
            </Link>
            {/* <div className="space-y-1">
              <button
                onClick={() => toggleMenu("gyms")}
                className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                  isActive("/gyms")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text"
                } flex items-center justify-between group transition-colors`}
              >
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                  My Gyms
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    expandedMenus.gyms ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedMenus.gyms && (
                <div className="pl-10 space-y-1">
                  <Link
                    to="/gym/management/gymlist"
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/gymlist"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    All Gyms
                  </Link>
                  <Link
                    to="/gym/management/create"
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/create"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    <div className="flex items-center">
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Add New Gym
                    </div>
                  </Link>
                </div>
              )}
            </div> */}

            {/* Courses Section */}
            <div className="space-y-1">
              <button
                onClick={() => toggleMenu("courses")}
                className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                  isActive("/courses")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text"
                } flex items-center justify-between group transition-colors`}
              >
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                  Courses
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    expandedMenus.courses ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedMenus.courses && (
                <div className="pl-10 space-y-1">
                  {/* <Link
                    to="/gym/management/courses/active"
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/courses/active"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    Active Courses
                  </Link>
                  <Link
                    to="/gym/management/courses/completed"
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/courses/completed"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    Completed Courses
                  </Link> */}
                  <Link
                    to={gymData ? `/gym/management/${gymData._id}/courses/create` : "/gym/management/create"}
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/courses/create"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    <div className="flex items-center">
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      {gymData ? "Create Course" : "Create Gym First"}
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Boxers */}
            <div className="space-y-1">
              <button
                onClick={() => toggleMenu("boxers")}
                className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                  isActive("/boxers")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text"
                } flex items-center justify-between group transition-colors`}
              >
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                  Boxers
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    expandedMenus.boxers ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedMenus.boxers && (
                <div className="pl-10 space-y-1">
                  <Link
                    to={gymData? `/gym/management/${gymData._id}/boxers/list` : `gym/management/create`}
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/boxers/list"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    All Boxers
                  </Link>
                  <Link
                    to={gymData? `/gym/management/${gymData._id}/boxers/create` : `gym/management/create`}
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/boxer/create"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    <div className="flex items-center">
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Add New Boxer
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Trainers */}
            <div className="space-y-1">
              <button
                onClick={() => toggleMenu("trainers")}
                className={`w-full p-2 rounded-md hover:bg-primary/10 ${
                  isActive("/trainers")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text"
                } flex items-center justify-between group transition-colors`}
              >
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
                  Trainers
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    expandedMenus.trainers ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedMenus.trainers && (
                <div className="pl-10 space-y-1">
                  <Link
                    to={gymData? `/gym/management/${gymData._id}/trainers/list` : `gym/management/create`}
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/trainers/list"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    All Trainers
                  </Link>
                  <Link
                    to={gymData? `/gym/management/${gymData._id}/trainers/create` : `gym/management/create`}
                    className={`block p-2 rounded-md hover:bg-primary/10 ${
                      location.pathname === "/gym/management/trainers/create"
                        ? "text-primary"
                        : "text-text"
                    } text-sm transition-colors`}
                  >
                    <div className="flex items-center">
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      Add New Trainer
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link
            to={gymData? `/gym/management/${gymData._id}/coursePackage` : `gym/management/create`}
            className="p-2 rounded-md hover:bg-primary hover:text-white text-text"
          >
            Course Package
          </Link>
            {/* Schedule */}
            {/* <Link
              to="/gym/management/schedule"
              className={`p-2 rounded-md hover:bg-primary/10 ${
                isActive("/schedule")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text"
              } flex items-center group transition-colors`}
            >
              <CalendarIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
              Schedule
            </Link> */}

            {/* Reports */}
            {/* <Link
              to="/gym/management/reports"
              className={`p-2 rounded-md hover:bg-primary/10 ${
                isActive("/reports")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text"
              } flex items-center group transition-colors`}
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-3 group-hover:text-primary" />
              Reports
            </Link> */}

            {/* All My Gyms Section */}
            {showMultipleGyms && (
              <div className="mt-5 pt-5 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-text/60 uppercase">
                    My Gyms
                  </h3>
                  <Link
                    to="/gym/management/create"
                    className="text-primary hover:text-secondary text-xs"
                  >
                    <PlusCircleIcon className="inline-block h-3 w-3 mr-1" />
                    New
                  </Link>
                </div>

                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {userGyms.map((gym) => (
                    <button
                      key={gym._id}
                      onClick={() => handleGymChange(gym._id)}
                      className={`w-full p-2 rounded-lg text-left text-xs flex items-center ${
                        gymData?._id === gym._id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-text hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {gym.gym_image_url && gym.gym_image_url.length > 0 ? (
                        <img
                          src={gym.gym_image_url[0]}
                          alt={gym.gym_name}
                          className="h-6 w-6 rounded-full object-cover mr-2 border border-border/50"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
                          <BuildingStorefrontIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="truncate">{gym.gym_name}</span>
                      {gymData?._id === gym._id && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

      {/* Gym Switcher Modal */}
      {showGymSwitcher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden border border-border/30">
            <div className="p-4 border-b border-border/30 flex justify-between items-center">
              <h3 className="font-semibold text-text">Switch Gym</h3>
              <button
                onClick={() => setShowGymSwitcher(false)}
                className="text-text/70 hover:text-text"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {userGyms.map((gym) => (
                  <button
                    key={gym._id}
                    onClick={() => handleGymChange(gym._id)}
                    className={`w-full p-3 rounded-lg text-left flex items-center ${
                      gymData?._id === gym._id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-card hover:bg-gray-100 dark:hover:bg-gray-700 border border-border/30"
                    }`}
                  >
                    {gym.gym_image_url && gym.gym_image_url.length > 0 ? (
                      <img
                        src={gym.gym_image_url[0]}
                        alt={gym.gym_name}
                        className="h-12 w-12 rounded-full object-cover mr-3 border border-border/50"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        <BuildingStorefrontIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          gymData?._id === gym._id
                            ? "text-primary"
                            : "text-text"
                        }`}
                      >
                        {gym.gym_name}
                      </h4>
                      <p className="text-sm text-text/70 truncate">
                        {gym.description || "No description"}
                      </p>
                    </div>
                    {gymData?._id === gym._id && (
                      <div className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                        Current
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/30">
                <Link
                  to="/gym/management/create"
                  className="flex items-center justify-center w-full p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setShowGymSwitcher(false)}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Create New Gym
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GymManageSidebar;
