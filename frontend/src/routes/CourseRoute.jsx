import { Routes, Route } from "react-router-dom";
import CourseHome from "../pages/courses/CourseHome";
import MainLayout from "../layouts/MainLayout";

function CourseRoutes() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout><CourseHome /></MainLayout>} />
      </Routes>
  );
}

export default CourseRoutes;
