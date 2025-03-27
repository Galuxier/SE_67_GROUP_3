import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/users/UserProfile";
import MainLayout from "../layouts/MainLayout";
import Enrollment from "../pages/Enrollment";
import Setting from "../pages/users/Setting";
import UserOrders from "../pages/users/UserOrder";
import OrderDetail from "../pages/users/OrderDetail";

function UserRoutes() {
  return (
    <Routes>
      {/* มี Layout(Navbar) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<UserProfile />} />
        <Route path="/:encoded_id" element={<UserProfile />} />
        <Route path="settings" element={<Setting />}/>
        <Route path="orders" element={<UserOrders />}/>
        <Route path="orders/:order_id" element={<OrderDetail />}/>

      </Route>

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/enrollment" element={<Enrollment />} />
    </Routes>
  );
}

export default UserRoutes;
