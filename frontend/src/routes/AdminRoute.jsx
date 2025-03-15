import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/admin/Dashboard";

function ShopRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
        </Route>
          
        {/* ไม่มี Layout(Navbar) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
      </Routes>
  );
}

export default ShopRoutes;