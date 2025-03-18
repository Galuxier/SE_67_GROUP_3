import { useTheme } from "../../context/ThemeContext";
import { BsMoon, BsSun, BsPersonCircle } from "react-icons/bs";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="fixed top-0 left-64 right-0 p-4 flex justify-end items-center bg-bar border-b border-border"
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {isDarkMode ? (
          <BsSun className="text-yellow-500 w-6 h-6" />
        ) : (
          <BsMoon className="text-gray-700 dark:text-gray-300 w-6 h-6" />
        )}
      </button>

      {/* Profile Dropdown */}
      <Menu as="div" className="relative">
        <MenuButton className="flex items-center p-2 rounded-full hover:bg-primary hover:text-white">
          <BsPersonCircle className="w-6 h-6 text-text" />
        </MenuButton>
        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black/5 focus:outline-none border border-border">
          <MenuItem>
            <div className="px-4 py-2 text-sm text-text">
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </MenuItem>
          <hr className="border-border" />
          <MenuItem>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-sm text-left text-text hover:bg-primary hover:text-white"
            >
              Logout
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default AdminNavbar;