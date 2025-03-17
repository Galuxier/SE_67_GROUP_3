import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // เพิ่ม useLocation
import { BsList, BsPersonCircle, BsSearch, BsMoon, BsSun } from "react-icons/bs";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // ใช้ useLocation เพื่อดึง path ปัจจุบัน

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ฟังก์ชันสำหรับตรวจสอบ path
  const getBasePath = (path) => {
    return path.split("/")[1]; // แยกส่วนแรกของ path
  };

  const basePath = getBasePath(location.pathname); // ดึงส่วนแรกของ path ปัจจุบัน

  const path = [
    { name: "Course", path: "/course" },
    { name: "Gym", path: "/gym" },
    { name: "Event", path: "/event" },
    { name: "Shop", path: "/shop" },
  ];

  return (
    <header className="bg-bar shadow-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo หรือลิงก์ Home */}
        <Link to="/" className="block text-primary dark:text-rose-400">
          <span className="sr-only">Home</span>
          <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
              fill="currentColor"
            />
          </svg>
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Navigation Links */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-medium">
              {path.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-text transition hover:text-primary ${
                      basePath === item.path.split("/")[1] ? "text-textmain font-bold" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side: Search, Dark Mode, Profile, and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex items-center">
              {/* Mobile: แสดงแค่ไอคอน Search */}
              <button className="md:hidden p-2 rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <BsSearch className="size-5" />
              </button>

              {/* Desktop: แสดงช่องค้นหาเต็มรูปแบบ */}
              <form className="hidden md:block relative">
                <div className="flex relative">
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-[160px] lg:w-[200px] rounded-full py-1.5 px-4 border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-800 text-text dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all"
                  />
                  <button className="absolute right-1 p-1.5 mt-[2px] rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <BsSearch className="size-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Dark Mode Toggle with Icons */}
            <div className="flex items-center gap-2">
              {/* ปุ่ม Dark Mode Toggle */}
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
            </div>

            {/* Profile Dropdown หรือปุ่ม Login/Signup */}
            {user ? (
              <>
                {/* Notification */}
                <button
                  type="button"
                  className="relative rounded-full p-2 text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <BellIcon className="size-5" />
                </button>

                {/* Profile Menu */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <BsPersonCircle className="size-6" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:text-white">
                    <MenuItem>
                      <Link
                        to={`/user/profile/${user.username}`}
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
              </>
            ) : (
              <div className="flex gap-4">
                {/* ปุ่ม Signup */}
                <Link
                  to="/signup"
                  className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Signup
                </Link>

                {/* ปุ่ม Login */}
                <Link
                  to="/login"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 hover:shadow-md transition-all dark:bg-rose-400 dark:hover:bg-rose-500"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="block rounded-sm bg-secondary p-2.5 text-text hover:bg-gray-100 md:hidden dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="sr-only">Toggle menu</span>
              <BsList className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul className={`flex-col md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        {path.map((item) => (
          <li key={item.path} className="py-1">
            <Link
              to={item.path}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}

export default Navbar;