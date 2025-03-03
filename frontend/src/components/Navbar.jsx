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
    navigate("/login"); // เปลี่ยนเส้นทางไปที่หน้า Home หลังจาก logout
  };

  const path = [
    { name: "Course", path: "/course" },
    { name: "Gym", path: "/gym" },
    { name: "Event", path: "/event" },
    { name: "Shop", path: "/shop" },
  ]

  return (
    <nav className="p-4 shadow-md">
      <div className="flex items-center justify-between mx-[100px]">
        <div className="flex space-x-5">
          <div className="text-rose-600 font-bold">
            <Link to="/" className="hover:text-rose-500 text-xl">Home</Link>
          </div>
                <ul className="hidden md:flex space-x-5">
            {path.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`rounded-md ml-5 py-2 text-xl font-medium hover:text-rose-600 
                    ${location.pathname === item.path ? "text-rose-600 font-bold" : ""}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
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

         {/* Profile dropdown หรือปุ่ม Login/Signup */}
          {user ? (
            <>
              {/* Notification */}
              <button type="button" className="relative rounded-full p-1 mr-2 hover:text-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-rose-600">
                <BellIcon className="size-8" />
              </button>

              <Menu as="div" className="relative">
                <MenuButton className="flex rounded-full hover:text-rose-600 focus:ring-2 focus:ring-rose focus:ring-offset-2 focus:ring-offset-rose-600">
                  <BsPersonCircle className="size-7" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem>
                    <Link to="/user/profile" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/settings" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/contact" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100">
                      Contact us
                    </Link>
                  </MenuItem>
                  <hr className="border-gray-300" />
                  <MenuItem>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-1 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/signup" className="border border-rose-600 text-rose-600 px-4 py-2 rounded-md hover:bg-rose-600 hover:text-white">
                Signup
              </Link>
              <Link to="/login" className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700">
                Login
              </Link>
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