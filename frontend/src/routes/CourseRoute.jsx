
import { Routes, Route } from "react-router-dom";
// import CourseHome from "../pages/courses/CourseHome";
import MainLayout from "../layouts/MainLayout";
import CourseDetail from "../pages/courses/CourseDetail";
import CreateCourse from "../pages/courses/CreateCourse";
import CourseFrom from "../pages/courses/CourseFrom";
import CourseBuyFrom from "../pages/courses/CourseBuyFrom";
import MuayThaiCourses from "../pages/courses/CourseHome";

function CourseRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MuayThaiCourses />} />
          <Route path ="courseDetail" element={<CourseDetail />} />
          <Route path ="createCourse" element={<CreateCourse />} />
          <Route path ="courseFrom" element={<CourseFrom />} />
          <Route path ="courseBuyFrom"  element={<CourseBuyFrom />} />
        </Route>

        {/* มี Layout(Navbar) */}
      </Routes>
  );
}

export default CourseRoutes;

