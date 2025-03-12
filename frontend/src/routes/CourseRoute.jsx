
import { Routes, Route,  } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import CourseDetail from "../pages/courses/CourseDetail";
import CreateCourse from "../pages/courses/CreateCourse";
import CourseFrom from "../pages/courses/CourseFrom";
import CourseBuyFrom from "../pages/courses/CourseBuyFrom";
import MuayThaiCourses from "../pages/courses/CourseHome";
import  Checkout from "../pages/courses/CourseCheck"; //หน้าก่อนการซื้อ
import CourseCheck from "../pages/courses/CourseBuyCheck"; //หน้าซ์้อแล้ว
import EditCourse from "../pages/courses/EditCourse";
import EditCourseFrom from "../pages/courses/EditCourseFrom";
import AdminHome from "../pages/admin/AdminHome";
function CourseRoutes() {
  return (
      <Routes>
        {/* มี Layout(Navbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MuayThaiCourses />} />
          <Route path ="/courseDetail" element={<CourseDetail />} />
          <Route path ="/courseBuyFrom"  element={<CourseBuyFrom />} />
          <Route path ="/adminHome" element={<AdminHome />} />
        </Route>

        {/* ไม่มี Layout(Navbar) */}
        <Route path ="/editCourseFrom" element={<EditCourseFrom />} />
        <Route path ="/editCourse" element={<EditCourse />} />
        <Route path ="/courseBuyCheckout" element={<CourseCheck />} />
        <Route path ="/courseCheck" element={< Checkout />} />  
        <Route path ="/courseFrom" element={<CourseFrom />} />
        <Route path ="/createCourse" element={<CreateCourse />} />
      </Routes>
  );
}

export default CourseRoutes;

