import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsList, BsPersonCircle, BsSearch, BsMoon, BsSun } from "react-icons/bs";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationBell from "./NotificationBell";
import { getImage } from "../../services/api/ImageApi";  

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
  const { user, logout, loading } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const encodeUserId = (userId) => {
    // Simple base64 encoding
    return btoa(userId);
  };

  useEffect(() => {
    const loadProfilePicture = async () => {
      if (user?.profile_picture_url) {
        setIsProfilePictureLoading(true);
        try {
          const imageData = await getImage(user.profile_picture_url);
          setProfilePicture(imageData);
        } catch (error) {
          console.error("Failed to load profile picture:", error);
          setProfilePicture("");
        } finally {
          setIsProfilePictureLoading(false);
        }
      } else {
        setProfilePicture("");
      }
    };

    loadProfilePicture();
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getBasePath = (path) => {
    return path.split("/")[1];
  };

  const basePath = getBasePath(location.pathname);
  const isHomePage = location.pathname === "/";

  const path = [
    { name: "Course", path: "/course" },
    { name: "Gym", path: "/gym" },
    { name: "Event", path: "/event" },
    { name: "Shop", path: "/shop" },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="bg-bar shadow-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="block text-primary dark:text-rose-400">
            <span className="sr-only">Home</span>
            <svg width="50" height="50" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path fill="#E11D48" d="M198.844 64.75c-.985 0-1.974.03-2.97.094-15.915 1.015-32.046 11.534-37.78 26.937-34.072 91.532-51.085 128.865-61.5 222.876 14.633 13.49 31.63 26.45 50.25 38.125l66.406-196.467 17.688 5.968L163.28 362.5c19.51 10.877 40.43 20.234 62 27.28l75.407-201.53 17.5 6.53-74.937 200.282c19.454 5.096 39.205 8.2 58.78 8.875L381.345 225.5l17.094 7.594-75.875 170.656c21.82-1.237 43.205-5.768 63.437-14.28 43.317-53.844 72.633-109.784 84.5-172.69 5.092-26.992-14.762-53.124-54.22-54.81l-6.155-.282-2.188-5.75c-8.45-22.388-19.75-30.093-31.5-32.47-11.75-2.376-25.267 1.535-35.468 7.376l-13.064 7.47-.906-15c-.99-16.396-10.343-29.597-24.313-35.626-13.97-6.03-33.064-5.232-54.812 9.906l-10.438 7.25-3.812-12.125c-6.517-20.766-20.007-27.985-34.78-27.97zM103.28 188.344C71.143 233.448 47.728 299.56 51.407 359.656c27.54 21.84 54.61 33.693 80.063 35.438 14.155.97 27.94-1.085 41.405-6.438-35.445-17.235-67.36-39.533-92.594-63.53l-3.343-3.157.5-4.595c5.794-54.638 13.946-91.5 25.844-129.03z"/>
            </svg>
          </Link>

          <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-medium">
                {path.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-text transition hover:text-primary ${
                        basePath === item.path.split("/")[1] ? "text-highlight font-bold" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <button className="md:hidden p-2 rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <BsSearch className="size-5" />
                </button>
              </div>

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

              {user ? (
                <>
                  <NotificationBell />
                  <Menu as="div" className="relative">
                    <MenuButton className="flex rounded-full text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      {isProfilePictureLoading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse dark:bg-gray-700" />
                      ) : profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <BsPersonCircle className="size-8" />
                      )}
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-card py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:text-white">
                      <MenuItem>
                        <Link
                          to={`/user/${encodeUserId(user._id)}`}
                          className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Your Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/user/settings"
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

                      {user?.role && (
                        <>
                          {(user.role.includes('gym_owner') || user.role.includes('organizer') || user.role.includes('shop_owner') || user.role.includes('lessor') || user.role.includes('admin')) && (
                            <div className="flex items-center my-1">
                              <hr className="flex-grow border-border dark:border-gray-600" />
                              <span className="px-2 text-sm text-gray-500 dark:text-gray-400">Management</span>
                              <hr className="flex-grow border-border dark:border-gray-600" />
                            </div>
                          )}

                          {user.role.includes('gym_owner') && (
                            <MenuItem>
                              <Link
                                to="/gym/management"
                                className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Gym/Course
                              </Link>
                            </MenuItem>
                          )}
                          {user.role.includes('trainer') && (
                            <MenuItem>
                              <Link
                                to="/trainer/management"
                                className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Trainer
                              </Link>
                            </MenuItem>
                          )}
                          {(user.role.includes('organizer') || user.role.includes('gym_owner')) && (
                            <MenuItem>
                              <Link
                                to="/event/management"
                                className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Event
                              </Link>
                            </MenuItem>
                          )}
                          {user.role.includes('shop_owner') && (
                            <MenuItem>
                              <Link
                                to="/shop/management"
                                className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Shop
                              </Link>
                            </MenuItem>
                          )}
                          {user.role.includes('lessor') && (
                            <MenuItem>
                              <Link
                                to="/place/management"
                                className="block px-4 py-1 text-sm text-text hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Place
                              </Link>
                            </MenuItem>
                          )}
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
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/signup"
                    className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Signup
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 hover:shadow-md transition-all dark:bg-rose-400 dark:hover:bg-rose-500"
                  >
                    Login
                  </Link>
                </div>
              )}

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
          {user && (
            <>
              <li className="py-1">
                <Link
                  to={`/user/${user.username}`}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Your Profile
                </Link>
              </li>
              <li className="py-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </li>
            </>
          )}
          {!user && (
            <>
              <li className="py-1">
                <Link
                  to="/signup"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Signup
                </Link>
              </li>
              <li className="py-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </header>

      {!isHomePage && !location.pathname.startsWith("/user") 
        && !location.pathname.startsWith('/shop/cart') 
        && !location.pathname.startsWith('/shop/productPayment') 
        && !location.pathname.startsWith("/payment")
        &&  (
        <div className="absolute w-full z-10 left-0 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center px-2 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3 mr-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707  9.293-2-2-7-7a1  1  0  0  0-1.414  0l-7  7-2  2a1  1  0  0  0  1.414  1.414L2  10.414V18a2  2  0  0  0  2  2h3a2  2  0  0  0  2-2v-4a2  2  0  0  1  2-2h2a2  2  0  0  1  2  2v4a2  2  0  0  0  2  2h3a2  2  0  0  0  2-2v-7.586l.293.293a1  1  0  0  0  1.414-1.414Z" />
                    </svg>
                    Home
                  </Link>
                </li>
                {location.pathname
                  .split("/")
                  .filter((path) => path !== "")
                  .map((path, index, arr) => (
                    <li key={index}>
                      <div className="flex items-center">
                        <svg
                          className="w-3 h-3 mx-1 text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                        <Link
                          to={`/${arr.slice(0, index + 1).join("/")}`}
                          className="ml-1 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                        >
                          {path.charAt(0).toUpperCase() + path.slice(1)}
                        </Link>
                      </div>
                    </li>
                  ))}
              </ol>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;