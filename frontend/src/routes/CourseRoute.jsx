
import { Routes, Route,  } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import CourseDetail from "../pages/courses/CourseDetail";

import CourseBuyFrom from "../pages/courses/CourseBuyFrom";
import MuayThaiCourses from "../pages/courses/CourseHome";
import  Checkout from "../pages/courses/CourseCheck"; //หน้าก่อนการซื้อ
// import EditCourse from "../pages/courses/EditCourse";
// import EditCourseFrom from "../pages/courses/EditCourseFrom";
// import CreateCourse from "../pages/courses/CreateCourse";
// import CourseFrom from "../pages/courses/CourseFrom";
function CourseRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MuayThaiCourses />} />
          <Route path ="/courseDetail" element={<CourseDetail />} />
          <Route path ="/courseBuyFrom"  element={<CourseBuyFrom />} />
          <Route path ="/courseCheck" element={< Checkout />} />  
        </Route>

        {/* ไม่มี Layout(Navbar) */}
        
      </Routes>
  );
}

export default CourseRoutes;

