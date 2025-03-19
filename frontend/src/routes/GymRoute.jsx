import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import GymManageLayout from "../layouts/GymManageLayout";
import { GymManagementRouteGuard } from "./guards/RouteGuard";

import GymHome from "../pages/gyms/GymHome";
import AddGym from "../pages/gyms/AddGym";
import GymDetail from "../pages/gyms/GymDetail";
import GymForRent from "../pages/gyms/GymForRent";
import GymManageDashboard from "../pages/gyms/managements/GymManageDashboard";

function GymRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<GymHome />} />
          <Route path="/:id" element={<GymDetail />} />
          
        </Route>

        <Route
          path="/management"
          element={
            <GymManagementRouteGuard>
              <GymManageLayout />
            </GymManagementRouteGuard>
          }
        >
          <Route index element={<GymManageDashboard />} />
        </Route>

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/addgym" element={<AddGym />} />
      <Route path="/forrent" element={<GymForRent />} />
    </Routes>
  );
}

export default GymRoutes;
