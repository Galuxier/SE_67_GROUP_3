import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsPersonCircle, BsSearch } from "react-icons/bs";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect ไปยังหน้า login หลังจากล็อกเอาท์
  };

  return (
    <nav className="p-4 shadow-md">
      <div className="flex items-center justify-between mx-[100px]">
        <div className="flex space-x-5">
          <div className="text-rose-600 font-bold">
            <Link to="/" className="hover:text-rose-500 text-xl">Home</Link>
          </div>
          <ul className="hidden md:flex space-x-5">
            <li><Link to="/course" className="rounded-md ml-5 py-2 text-xl font-medium hover:text-rose-600">Course</Link></li>
            <li><Link to="/gym" className="rounded-md ml-5 py-2 text-xl font-medium hover:text-rose-600">Gym</Link></li>
            <li><Link to="/event" className="rounded-md ml-5 py-2 text-xl font-medium hover:text-rose-600">Event</Link></li>
            <li><Link to="/shop" className="rounded-md ml-5 py-2 text-xl font-medium hover:text-rose-600">Shop</Link></li>
          </ul>
        </div>

        <div className="flex items-center space-x-5">
          {/* Search Bar */}
          <form className="w-[400px] relative">
            <div className="flex relative mr-5">
              <input type="search" placeholder="Search" className="w-full rounded-full py-3 px-5 border-2 border-rose-300" />
              <button className="absolute right-1 p-3 mt-[5px] rounded-full text-rose-600 hover:text-white hover:bg-rose-300 bg-rose-100">
                <BsSearch />
              </button>
            </div>
          </form>

          {/* Notification */}
          <button type="button" className="relative rounded-full p-1 mr-2 hover:text-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-rose-600">
            <BellIcon className="size-8" />
          </button>

          {/* Profile dropdown หรือปุ่ม Login/Signup */}
          {user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex rounded-full hover:text-rose-600 focus:ring-2 focus:ring-rose focus:ring-offset-2 focus:ring-offset-rose-600">
                <BsPersonCircle className="size-7" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem><Link to="/profile" className="block px-4 py-1 text-sm text-gray-700">Your Profile</Link></MenuItem>
                <MenuItem><Link to="/settings" className="block px-4 py-1 text-sm text-gray-700">Settings</Link></MenuItem>
                <MenuItem><Link to="/contact" className="block px-4 py-1 text-sm text-gray-700">Contact us</Link></MenuItem>
                <hr className="border-gray-300" />
                <MenuItem>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-1 text-sm text-gray-700">
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-rose-600 hover:text-rose-500">Login</Link>
              <Link to="/signup" className="text-rose-600 hover:text-rose-500">Signup</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              <BsList className="text-red-500 w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul className={`flex-col md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <li className="py-1"><Link to="/course">Course</Link></li>
        <li className="py-1"><Link to="/gym">Gym</Link></li>
        <li className="py-1"><Link to="/event">Event</Link></li>
        <li className="py-1"><Link to="/shop">Shop</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;