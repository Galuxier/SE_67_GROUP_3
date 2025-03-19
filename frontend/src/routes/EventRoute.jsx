import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EventManageLayout from "../layouts/EnevtManageLayout";
import { EventManagementRouteGuard } from "./guards/RouteGuard";

import EventHome from "../pages/events/EventHome";
import FormAddEvent from "../pages/events/AddEvent/AddEvent";
import FormAddSeat from "../pages/events/AddEvent/AddSeat";
import FormAddFighter from "../pages/events/AddEvent/AddFighter";
import FormAddWeightClass from "../pages/events/AddEvent/AddWeight";
import FormAddResult from "../pages/events/AddResult";
import EventDetail from "../pages/events/EventDetail";
import RegistrationForm from "../pages/events/RegistrationForm";
import EventManageDashboard from "../pages/events/managements/EventManageDashboard";


function EventRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<EventHome />} />
          <Route path="/:id" element={<EventDetail />} />
          <Route path="/register/:eventId" element={<RegistrationForm />} />

        </Route>

        <Route
          path="/management"
          element={
            <EventManagementRouteGuard>
              <EventManageLayout />
            </EventManagementRouteGuard>
          }
        >
          <Route index element={<EventManageDashboard />} />
        </Route>

        {/* ไม่มี Layout(Navbar) */}
        <Route path="/addEvent" element={<FormAddEvent />}/>
        <Route path="/addSeat" element={<FormAddSeat />}/>
        <Route path="/addFighter" element={<FormAddFighter />}/>
        <Route path="/addWeight" element={<FormAddWeightClass />}/>
        <Route path="/addResult" element={<FormAddResult />}/>
        
      </Routes>
  );
}

export default EventRoutes;
