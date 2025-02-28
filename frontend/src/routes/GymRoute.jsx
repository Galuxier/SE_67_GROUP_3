import { Routes, Route } from "react-router-dom";
import GymHome from "../pages/gyms/GymHome";
import AddGym from "../pages/gyms/AddGym";
import MainLayout from "../layouts/MainLayout";

function GymRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<GymHome />} />
        </Route>

        {/* ไม่มี Layout(Navbar) */}
        <Route path="/addgym" element={<AddGym />} />
      </Routes>
  );
}

export default GymRoutes;
