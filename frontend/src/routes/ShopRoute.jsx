import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ShopManageLayout from "../layouts/ShopManageLayout";
import { ShopManagementRouteGuard } from "./guards/RouteGuard";

import ShopHome from "../pages/shops/ShopHome";
import AddProduct from "../pages/shops/AddProduct";
import AddShop from "../pages/shops/AddShop";
import Summary from "../pages/shops/Summary";
import ProductDetail from "../pages/shops/ProductDetail";
import Cart from "../pages/shops/Cart";
import ShopProfile from "../pages/shops/ShopProfile";

import ShopManageDashboard from "../pages/shops/managements/ShopManageDashboard";

function ShopRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ShopHome />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile/:id" element={<ShopProfile />} />
        </Route>

        <Route
          path="/management/:shopId?"
          element={
            <ShopManagementRouteGuard>
              <ShopManageLayout />
            </ShopManagementRouteGuard>
          }
        >
          <Route index element={<ShopManageDashboard />} />
          
          {/* <Route path="/management/addProduct" element={<AddProduct />} /> */}
        </Route>
          
        {/* ไม่มี Layout(Navbar) */}
        <Route path="/management/addShop" element={<ShopManagementRouteGuard><AddShop /></ShopManagementRouteGuard>} />
          
          <Route path="/summary" element={<Summary />} />
          
      </Routes>
  );
}

export default ShopRoutes;