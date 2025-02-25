import { Routes, Route } from "react-router-dom";
import CourseHome from "../pages/courses/CourseHome";
import MainLayout from "../layouts/MainLayout";

function CourseRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CourseHome />} />
        </Route>

        {/* มี Layout(Navbar) */}
      </Routes>
  );
}

export default CourseRoutes;
