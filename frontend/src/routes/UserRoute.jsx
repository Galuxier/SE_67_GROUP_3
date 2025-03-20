import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/users/UserProfile";
import MainLayout from "../layouts/MainLayout";
import Enrollment from "../pages/Enrollment";

function UserRoutes() {
  return (
    <Routes>
      {/* มี Layout(Navbar) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<UserProfile />} />
        <Route path="/profile/:username" element={<UserProfile />} />
      </Route>

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/enrollment" element={<Enrollment />} />
    </Routes>
  );
}

export default UserRoutes;
