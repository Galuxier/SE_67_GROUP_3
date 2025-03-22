import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import GymHome from "../pages/gyms/GymHome";
import GymDetail from "../pages/gyms/GymDetail";
import GymForRent from "../pages/gyms/GymForRent";

import GymManageLayout from "../layouts/GymManageLayout";
import { GymManagementRouteGuard } from "./guards/RouteGuard";
import GymManageDashboard from "../pages/gyms/managements/GymManageDashboard";
import GymList from "../pages/gyms/managements/GymList";
import AddGym from "../pages/gyms/managements/AddGym";
import AddBoxer from "../pages/gyms/managements/AddBoxer";
import AddTrainer from "../pages/gyms/managements/AddTrainer";

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
          <Route path="/management/gymlist" element={<GymList />} />
          <Route path="/management/create" element={<AddGym />} />
          <Route path="/management/addboxer" element={<AddBoxer />}/>
          <Route path="/management/addtrainer" element={<AddTrainer />}/>
        </Route>

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/forrent" element={<GymForRent />} />
    </Routes>
  );
}

export default GymRoutes;
