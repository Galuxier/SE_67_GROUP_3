import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bar text-text border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="ml-2 text-xl font-bold text-primary">MuayThai</span>
            </div>
            <p className="text-sm mt-2 text-text/80">
              Your premier destination for Muay Thai training, events, and equipment.
              Join our community of fighters and enthusiasts today.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-text hover:text-primary transition-colors">
                <BsYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-text">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Courses", path: "/course" },
                { name: "Gyms", path: "/gym" },
                { name: "Events", path: "/event" },
                { name: "Shop", path: "/shop" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-text/80 hover:text-primary hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-text">Support</h3>
            <ul className="space-y-2">
              {[
                { name: "FAQ", path: "/faq" },
                { name: "Contact Us", path: "/contact" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Refund Policy", path: "/refund" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-text/80 hover:text-primary hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-text">Stay Updated</h3>
            <p className="text-sm text-text/80 mb-4">
              Subscribe to our newsletter for the latest updates on events, promotions, and training tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text/70">
              © {currentYear} MuayThai. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text/70">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
              <Link to="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;