import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout"; 
import Dashboard from "../pages/admin/Dashboard";
import Approval from "../pages/admin/Approval"; 

function AdminRoutes() {
  return (
    <Routes>
      {/* ใช้ AdminLayout สำหรับทุก Route ภายใต้ /admin */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Approval />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/approval" element={<Approval />} /> 
      </Route>
    </Routes>
  );
}

export default AdminRoutes;