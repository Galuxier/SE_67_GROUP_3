import { Routes, Route } from "react-router-dom";
import CourseHome from "../pages/courses/CourseHome";
import MainLayout from "../layouts/MainLayout";
import Course from "../pages/courses/Course";
import CreateCourse from "../pages/courses/CreateCourse";
function CourseRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CourseHome />} />
          <Route path ="courseFrom" element ={<Course />}  />
          <Route path ="createCourse" element={<CreateCourse />} />
        </Route>

        {/* มี Layout(Navbar) */}
      </Routes>
  );
}

export default CourseRoutes;
