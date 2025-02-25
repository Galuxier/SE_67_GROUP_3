import { Routes, Route } from "react-router-dom";
import ShopHome from "../pages/shops/ShopHome";
import MainLayout from "../layouts/MainLayout";

function ShopRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout><ShopHome /></MainLayout>} />
      </Routes>
  );
}

export default ShopRoutes;
