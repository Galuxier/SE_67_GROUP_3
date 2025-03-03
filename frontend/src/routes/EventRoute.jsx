import { Routes, Route } from "react-router-dom";
import EventHome from "../pages/events/EventHome";
import MainLayout from "../layouts/MainLayout";
<<<<<<< HEAD
import FormAddEvent from "../pages/events/AddEvent/AddEvent";
=======
import FormAddEvent from "../pages/events/AddEvent";
>>>>>>> main

function EventRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<EventHome />} />
        </Route>

        {/* ไม่มี Layout(Navbar) */}
        <Route path="/addEvent" element={<FormAddEvent />}/>
        
      </Routes>
  );
}

export default EventRoutes;
