import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PlaceManageLayout from "../layouts/PlaceManageLayout";
import { PlaceManagementRouteGuard } from "./guards/RouteGuard";

// import PlaceHome from "../pages/places/PlaceHome";
import PlaceManageDashboard from "../pages/places/managements/PlaceManageDashboard";
import AddPlace from "../pages/places/managements/AddPlace";
import PlaceList from "../pages/places/managements/PlaceList";
// import PlaceDetail from "../pages/places/PlaceDetail";

function PlaceRoutes() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* <Route index element={<PlaceHome />} />
        <Route path=":id" element={<PlaceDetail />} /> */}
      </Route>

      {/* Management Routes */}
      <Route
        path="/management"
        element={
          <PlaceManagementRouteGuard>
            <PlaceManageLayout />
          </PlaceManagementRouteGuard>
        }
      >
        <Route index element={<PlaceManageDashboard />} />
        <Route path="create" element={<AddPlace />} />
        <Route path="list" element={<PlaceList />} />
      </Route>
    </Routes>
  );
}

export default PlaceRoutes;