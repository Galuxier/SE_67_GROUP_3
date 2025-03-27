import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

const FooterLite = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bar text-text border-t border-border mt-auto">
      {/* Main Footer - Simplified */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo & About Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-3">
              <span className="text-xl font-bold text-primary">MuayThai</span>
            </div>
            <p className="text-sm text-text/80 mb-4 max-w-md">
              Your premier destination for Muay Thai training, events, and equipment.
            </p>
            {/* <div className="flex space-x-5 mt-3">
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsTwitter className="h-5 w-5" />
              </a>
            </div> */}
          </div>

          {/* Quick Links - Minimal Version */}
          <div className="col-span-1">
            <div className="flex flex-col md:flex-row md:justify-end">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-text">Quick Links</h3>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  {[
                    { name: "Home", path: "/" },
                    { name: "Courses", path: "/course" },
                    { name: "Gyms", path: "/gym" },
                    { name: "Events", path: "/event" },
                    { name: "Shop", path: "/shop" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-text/80 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Minimal */}
      <div className="border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-text/70">
              © {currentYear} MuayThai. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-text/70">
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLite;