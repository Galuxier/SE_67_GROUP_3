import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer"; // Import the Footer component
import FooterLite from "../components/footer/FooterLite";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const MainLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-background flex-grow">
        <Navbar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
      <FooterLite /> {/* Add the Footer component here */}
    </div>
  );
};

export default MainLayout;