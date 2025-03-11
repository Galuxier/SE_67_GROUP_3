import { Routes, Route } from "react-router-dom";
import EventHome from "../pages/events/EventHome";
import MainLayout from "../layouts/MainLayout";

import FormAddEvent from "../pages/events/AddEvent/AddEvent";
import FormAddSeat from "../pages/events/AddEvent/AddSeat";
import FormAddFighter from "../pages/events/AddEvent/AddFighter";
import FormAddWeightClass from "../pages/events/AddEvent/AddWeight";
import FormAddResult from "../pages/events/AddResult";



function EventRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<EventHome />} />
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
