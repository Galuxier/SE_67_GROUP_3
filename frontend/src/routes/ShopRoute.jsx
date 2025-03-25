import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ShopManageLayout from "../layouts/ShopManageLayout";
import { ShopManagementRouteGuard } from "./guards/RouteGuard";

import ShopHome from "../pages/shops/ShopHome";
import AddProduct from "../pages/shops/managements/AddProduct";
import AddShop from "../pages/shops/managements/AddShop";
import Summary from "../pages/shops/managements/Summary";
import ProductDetail from "../pages/shops/ProductDetail";
import Cart from "../pages/shops/Cart";
import ShopProfile from "../pages/shops/ShopProfile";
import ProductPayment from "../pages/shops/ProductPayment";
import ShopDetail from "../pages/shops/managements/ShopDetail";
import ShopManageDashboard from "../pages/shops/managements/ShopManageDashboard";

function ShopRoutes() {
  return (
    <Routes>
      {/* Main Shop Routes with Navbar */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ShopHome />} />
        <Route path=":shop_id" element={<ShopProfile />} />
        <Route path=":shop_id/:product_id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="productPayment" element={<ProductPayment />} />
      </Route>

      {/* Shop Management Routes */}
      <Route
        path="/management"
        element={<ShopManagementRouteGuard><ShopManageLayout /></ShopManagementRouteGuard>}
      >
        <Route index element={<ShopManageDashboard />} />
        <Route path="addShop" element={<AddShop />} />
        <Route path=":shopId" element={<ShopManageDashboard />} />
        <Route path=":shopId/detail" element={<ShopDetail />} />
        <Route path=":shopId/dashboard" element={<ShopManageDashboard />} />
        <Route path=":shopId/addProduct" element={<AddProduct />} />
        <Route path=":shopId/products" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/products/inventory" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/orders" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/orders/pending" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/orders/processing" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/orders/completed" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/customers" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/shipping" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/payments" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/settings/profile" element={<ShopDetail />} /> {/* Placeholder */}
        <Route path=":shopId/settings/payment" element={<AddProduct />} /> {/* Placeholder */}
        <Route path=":shopId/settings/shipping" element={<AddProduct />} /> {/* Placeholder */}
      </Route>

      {/* Routes without Navbar */}
      {/* <Route
        path="/shop/management/addShop"
        element={<ShopManagementRouteGuard><AddShop /></ShopManagementRouteGuard>}
      /> */}
      <Route path="/shop/summary" element={<Summary />} />
    </Routes>
  );
}

export default ShopRoutes;