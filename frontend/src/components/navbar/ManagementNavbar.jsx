import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { BsMoon, BsSun, BsPersonCircle } from "react-icons/bs";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManagementNavbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="top-0 left-64 right-0 p-4 flex justify-end items-center bg-bar border-b border-border z-50 overflow-visible pr-20"
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isDarkMode ? (
          <BsSun className="size-5 text-yellow-500" />
        ) : (
          <BsMoon className="size-5 text-gray-600" /> 
        )}
      </button>

      {/* Notification */}
      <button
        type="button"
        className="relative rounded-full p-2 text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2"
      >
        <BellIcon className="size-5" />
      </button>

      {/* Profile Menu */}
      <Menu as="div" className="relative ml-2">
        <MenuButton className="flex rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <BsPersonCircle className="size-6" />
        </MenuButton>
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:text-white">
          <MenuItem>
            <Link
              to={`/user/profile/${user?.username}`}
              className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Your Profile
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/settings"
              className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Settings
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/contact"
              className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Contact us
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/user/enrollment"
              className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Enrollment
            </Link>
          </MenuItem>
          
          {/* Role-specific menu items */}
          {user?.role && (
            <>
              <hr className="border-border dark:border-gray-600" />

              {/* Gym Management for gym_owner */}
              {user.role.includes('gym_owner') ? (
                <MenuItem>
                  <Link
                    to="/gym/management"
                    className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Gym Management
                  </Link>
                </MenuItem>
              ) : null}
              
              {/* Event Management for organizer and gym_owner */}
              {user.role.includes('organizer') || user.role.includes('gym_owner') ? (
                <MenuItem>
                  <Link
                    to="/event/management"
                    className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Event Management
                  </Link>
                </MenuItem>
              ) : null}
              
              {/* Shop Management for shop_owner */}
              {user.role.includes('shop_owner') && (
                <MenuItem>
                  <Link
                    to="/shop/management"
                    className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Shop Management
                  </Link>
                </MenuItem>
              )}
              
              {/* Place Management for lessor */}
              {user.role.includes('lessor') && (
                <MenuItem>
                  <Link
                    to="/place/management"
                    className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Place Management
                  </Link>
                </MenuItem>
              )}
              
              {/* Admin Dashboard for admin */}
              {user.role.includes('admin') && (
                <MenuItem>
                  <Link
                    to="/admin"
                    className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Admin
                  </Link>
                </MenuItem>
              )}
            </>
          )}
          
          <hr className="border-border dark:border-gray-600" />
          <MenuItem>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Sign out
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default ManagementNavbar;