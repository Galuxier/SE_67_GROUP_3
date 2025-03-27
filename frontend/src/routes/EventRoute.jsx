import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EventManageLayout from "../layouts/EventManageLayout";
import { EventManagementRouteGuard } from "./guards/RouteGuard";

import EventHome from "../pages/events/EventHome";
// import FormAddEvent from "../pages/events/AddEvent/AddEvent";
import FormAddEvent from "../pages/events/AddEvent/AddEventForm";
import FormAddSeat from "../pages/events/AddEvent/AddSeat";
import FormAddFighter from "../pages/events/AddEvent/AddFighter";
import FormAddWeightClass from "../pages/events/AddEvent/AddWeight";
import FormAddResult from "../pages/events/AddResult";
import EventDetail from "../pages/events/EventDetail";
import RegistrationForm from "../pages/events/RegistrationForm";
import EventManageDashboard from "../pages/events/managements/EventManageDashboard";
import EventList from "../pages/events/managements/EventList";
import BuyTicket from "../pages/events/BuyTicket";
import TicketPayment from "../pages/events/TicketPayment";
import OnGoingEvent from "../pages/events/managements/OnGoingEvent";


function EventRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<EventHome />} />
          <Route path="/:id" element={<EventDetail />} />
          <Route path="/register/:eventId" element={<RegistrationForm />} />
          <Route path="/ticket/:eventId" element={<BuyTicket />} />
          <Route path="/ticket/payment" element={<TicketPayment />} />


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
          <Route index element={<EventManageDashboard />} />
          <Route path="/management/create" element={<FormAddEvent/>}/>
          <Route path="/management/eventList" element={<EventList/>}/>
          <Route path="/management/create/seat" element={<FormAddSeat />}/>
          <Route path="/management/create/match" element={<FormAddFighter />}/>
          <Route path="/management/create/weightClass" element={<FormAddWeightClass />}/>
          <Route path="/management/onGoing" element={<OnGoingEvent />}/>
        </Route>

        {/* ไม่มี Layout(Navbar) */}
        {/* <Route path="/addEvent" element={<FormAddEvent />}/>
        <Route path="/addSeat" element={<FormAddSeat />}/>
        <Route path="/addFighter" element={<FormAddFighter />}/>
        <Route path="/addWeight" element={<FormAddWeightClass />}/>
        <Route path="/addResult" element={<FormAddResult />}/> */}
        
      </Routes>
  );
}

export default EventRoutes;
