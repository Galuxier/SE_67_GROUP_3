import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PackagePayment from "../pages/PackagePayment";
import ProductPayment from "../pages/shops/ProductPayment";
import  CoursePayment from "../pages/courses/CourseCheck"; 

function PackageRoutes() {
  return (
    <Routes>
      {/* มี Layout(Navbar) */}
      <Route path="/" element={<MainLayout />}>
        <Route path="package" element={<PackagePayment />} />
        <Route path="products" element={<ProductPayment />} />
        <Route path="course" element={<CoursePayment />} />
      </Route>

      {/* ไม่มี Layout(Navbar) */}
    </Routes>
  );
}

export default PackageRoutes;
