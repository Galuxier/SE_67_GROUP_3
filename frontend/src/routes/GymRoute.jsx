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

import CreateCourse from "../pages/courses/CreateCourse";
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
          
        </Route>

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/manage/courses/create" element ={<CreateCourse />}/>
      <Route path="/forrent" element={<GymForRent />} />
    </Routes>
  );
}

export default GymRoutes;
