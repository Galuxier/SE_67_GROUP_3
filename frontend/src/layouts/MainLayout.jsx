import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // นำเข้า useTheme

const MainLayout = () => {
  const { isDarkMode } = useTheme(); // ดึงสถานะ Dark Mode

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-800">
        <Navbar />
        <div className="p-4 dark:bg-gray-800 dark:text-white">
          <Outlet /> {/* ใช้ Outlet เพื่อให้แสดงหน้าที่แตกต่างกัน */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

