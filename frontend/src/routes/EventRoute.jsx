import { Routes, Route } from "react-router-dom";
import EventHome from "../pages/events/EventHome";
import MainLayout from "../layouts/MainLayout";

function EventRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout><EventHome /></MainLayout>} />
      </Routes>
  );
}

export default EventRoutes;
