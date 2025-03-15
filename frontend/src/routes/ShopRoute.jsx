import { Routes, Route } from "react-router-dom";
import ShopHome from "../pages/shops/ShopHome";
import AddProduct from "../pages/shops/AddProduct";
import AddShop from "../pages/shops/AddShop";
import Summary from "../pages/shops/Summary";
import MainLayout from "../layouts/MainLayout";
import ProductDetail from "../pages/shops/ProductDetail";
import Cart from "../pages/shops/Cart";
import ShopProfile from "../pages/shops/ShopProfile";

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
          
        {/* ไม่มี Layout(Navbar) */}
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/addShop" element={<AddShop />} />
          <Route path="/summary" element={<Summary />} />
          
      </Routes>
  );
}

export default ShopRoutes;