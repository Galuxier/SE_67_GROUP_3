import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/users/UserProfile";
import MainLayout from "../layouts/MainLayout";

function UserRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<UserProfile />} />
        </Route>

        {/* มี Layout(Navbar) */}
      </Routes>
  );
}

export default UserRoutes;
