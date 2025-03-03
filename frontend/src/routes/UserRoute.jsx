import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/users/UserProfile";
import MainLayout from "../layouts/MainLayout";
import AddRole from "../pages/users/AddRole";

function UserRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          {/* <Route index element={<UserProfile />} /> */}
          <Route path="/profile" element={<UserProfile />}/>
        </Route>

        {/* มี Layout(Navbar) */}
        <Route path="/addRole" element={<AddRole />} />
      </Routes>
  );
}

export default UserRoutes;
