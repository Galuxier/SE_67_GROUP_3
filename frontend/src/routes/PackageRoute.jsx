import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PackagePayment from "../pages/PackagePayment";

function PackageRoutes() {
  return (
    <Routes>
      {/* มี Layout(Navbar) */}
      <Route path="/" element={<MainLayout />}>
        <Route path="packagePayment" element={<PackagePayment />} />

      </Route>

      {/* ไม่มี Layout(Navbar) */}
    </Routes>
  );
}

export default PackageRoutes;
