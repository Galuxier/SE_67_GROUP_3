import { Routes, Route } from "react-router-dom";
import GymHome from "../pages/gyms/GymHome";
import AddGym from "../pages/gyms/AddGym";
import MainLayout from "../layouts/MainLayout";

function GymRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route/>
        </Route>



        <Route path="addgym" element={<MainLayout><AddGym /></MainLayout>} />
      </Routes>
  );
}

export default GymRoutes;
