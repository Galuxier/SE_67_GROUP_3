import { Routes, Route } from "react-router-dom";
import GymHome from "../pages/gyms/GymHome";
import AddGym from "../pages/gyms/AddGym";
import MainLayout from "../layouts/MainLayout";

function GymRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout><GymHome /></MainLayout>} />
        <Route path="addgym" element={<AddGym />} />
      </Routes>
  );
}

export default GymRoutes;
