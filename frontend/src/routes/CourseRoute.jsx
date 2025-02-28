import { Routes, Route } from "react-router-dom";
import CourseHome from "../pages/courses/CourseHome";
import MainLayout from "../layouts/MainLayout";
import Course from "../pages/courses/Course";
import CreateCourse from "../pages/courses/CreateCourse";
import MuayThaiCourses from "../pages/courses/CourseTotal";
import CourseDetail from "../pages/courses/CourseDetail";
function CourseRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CourseHome />} />
          <Route path ="courseFrom" element ={<Course />}  />
          <Route path ="createCourse" element={<CreateCourse />} />
          <Route path ="courseDetail" element={<CourseDetail />} />
          <Route path ="muayThaiCourses" element={<MuayThaiCourses />} />

        </Route>

        {/* มี Layout(Navbar) */}
      </Routes>
  );
}

export default CourseRoutes;
