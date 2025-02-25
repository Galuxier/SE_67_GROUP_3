import { Routes, Route } from "react-router-dom";
import EventHome from "../pages/events/EventHome";
import MainLayout from "../layouts/MainLayout";

function EventRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<EventHome />} />
        </Route>

        {/* มี Layout(Navbar) */}
        
      </Routes>
  );
}

export default EventRoutes;
