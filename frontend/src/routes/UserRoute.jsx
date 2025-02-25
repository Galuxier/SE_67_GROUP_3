import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/users/UserProfile";
import MainLayout from "../layouts/MainLayout";

function UserRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout><UserProfile /></MainLayout>} />
      </Routes>
  );
}

export default UserRoutes;
