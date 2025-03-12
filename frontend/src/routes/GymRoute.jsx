import { Routes, Route } from "react-router-dom";
import GymHome from "../pages/gyms/GymHome";
import AddGym from "../pages/gyms/AddGym";
import MainLayout from "../layouts/MainLayout";
import GymDetail from "../pages/gyms/GymDetail";
import GymForRent from "../pages/gyms/GymForRent";
import { Ticket } from "lucide-react";

function GymRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<GymHome />} />
          <Route path="/detail/:id" element={<GymDetail />} />
          
        </Route>

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/addgym" element={<AddGym />} />
      <Route path="/forrent" element={<GymForRent />} />
    </Routes>
  );
}

export default GymRoutes;
