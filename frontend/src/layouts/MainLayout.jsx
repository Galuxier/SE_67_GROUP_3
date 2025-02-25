import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Outlet />  {/* ใช้ Outlet เพื่อให้แสดงหน้าที่แตกต่างกัน */}
      </div>
    </div>
  );
};

export default MainLayout;


