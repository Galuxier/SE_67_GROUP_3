import { Routes, Route } from "react-router-dom";
import ShopHome from "../pages/shops/ShopHome";
import MainLayout from "../layouts/MainLayout";

function ShopRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ShopHome />} />
        </Route>

        {/* มี Layout(Navbar) */}
      </Routes>
  );
}

export default ShopRoutes;
