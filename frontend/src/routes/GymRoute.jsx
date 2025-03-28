import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import GymHome from "../pages/gyms/GymHome";
import GymDetail from "../pages/gyms/GymDetail";
import GymForRent from "../pages/gyms/GymForRent";

import GymManageLayout from "../layouts/GymManageLayout";
import { GymManagementRouteGuard } from "./guards/RouteGuard";
import GymManageDashboard from "../pages/gyms/managements/GymManageDashboard";
import GymList from "../pages/gyms/managements/GymList";
import AddGym from "../pages/gyms/managements/AddGym";
import AddBoxer from "../pages/gyms/managements/AddBoxer";
import AddTrainer from "../pages/gyms/managements/AddTrainer";
import CreateCourseForm from "../pages/courses/managements/CreateCourseForm";
import TrainerList from "../pages/gyms/managements/TrainerList";
import BoxerList from "../pages/gyms/managements/BoxerList";
import GymInfo from "../pages/gyms/managements/GymInfo";
import UserProfile from "../pages/users/UserProfile";
import CoursePackage from "../pages/gyms/managements/CoursePackage";
import CourseList from "../pages/gyms/managements/CourseList";

import EditCourseForm from "../pages/courses/managements/EditCourseForm";
import CourseEnrollmentAll from "../pages/gyms/managements/CourseEnrollmentAll";
import CourseEnrollmentPending from "../pages/gyms/managements/CourseEnrollmentPending";
import CourseEnrollmentCompleted from "../pages/gyms/managements/CourseEnrollmentCompleted";


function GymRoutes() {
  return (
    <Routes>
      {/* มี Layout(Navbar) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<GymHome />} />
        <Route path=":id" element={<GymDetail />} />
      </Route>

      {/* Management Routes */}
      <Route
        path="/management"
        element={
          <GymManagementRouteGuard key="management">
            <GymManageLayout />
          </GymManagementRouteGuard>
        }
      >
        <Route index element={<GymManageDashboard />} />
        <Route path=":gym_id" element={<GymManageDashboard />} />
        <Route path=":gym_id/edit" element={<GymInfo />} />
        <Route path="gymlist" element={<GymList />} />
        <Route path="create" element={<AddGym />} />

        <Route path=":gym_id/boxers/create" element={<AddBoxer />} />
        <Route path=":gym_id/trainers/create" element={<AddTrainer />} />
        <Route path=":gym_id/courses/create" element={<CreateCourseForm />} />

        <Route path=":gym_id/boxers/list" element={<BoxerList />} />
        <Route path=":gym_id/trainers/list" element={<TrainerList />} />
        <Route path="user/:username" element={<UserProfile />} />
        <Route path=":gym_id/coursePackage" element={<CoursePackage />} />
        <Route path=":gym_id/courses/list" element={<CourseList/>}/>
        <Route path=":gym_id/course/edit/:course_id" element={<EditCourseForm />} />
        <Route path=":gym_id/courseEnrollment/all" element={<CourseEnrollmentAll />} />
        <Route path=":gym_id/courseEnrollment/pending" element={<CourseEnrollmentPending />} />
        <Route path=":gym_id/courseEnrollment/completed" element={<CourseEnrollmentCompleted />} />
      </Route>

      {/* Course Routes */}
      {/* <Route path="/editCourseFrom" element={<EditCourseFrom />} />
      <Route path="/editCourse" element={<EditCourse />} /> */}

      {/* ไม่มี Layout(Navbar) */}
      <Route path="/forrent" element={<GymForRent />} />
    </Routes>
  );
}

export default GymRoutes;

// import { Routes, Route } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";

// import GymHome from "../pages/gyms/GymHome";
// import GymDetail from "../pages/gyms/GymDetail";
// import GymForRent from "../pages/gyms/GymForRent";

// import GymManageLayout from "../layouts/GymManageLayout";
// import { GymManagementRouteGuard } from "./guards/RouteGuard";
// import GymManageDashboard from "../pages/gyms/managements/GymManageDashboard";
// import GymList from "../pages/gyms/managements/GymList";
// import AddGym from "../pages/gyms/managements/AddGym";
// import AddBoxer from "../pages/gyms/managements/AddBoxer";
// import AddTrainer from "../pages/gyms/managements/AddTrainer";
// import EditCourse from "../pages/courses/EditCourse";
// import EditCourseFrom from "../pages/courses/EditCourseFrom";
// // import CreateCourse from "../pages/courses/CreateCourse";
// // import CourseFrom from "../pages/courses/CourseFrom";
// import CreateCourseForm from "../pages/courses/managements/CreateCourseForm";
// import TrainerList from "../pages/gyms/managements/TrainerList";
// import BoxerList from "../pages/gyms/managements/BoxerList";
// import GymInfo from "../pages/gyms/managements/GymInfo";

// function GymRoutes() {
//   return (
//     <Routes>
//       {/* มี Layout(Navbar) */}
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<GymHome />} />
//         <Route path="/:id" element={<GymDetail />} />
//       </Route>

//       {/* Management Routes */}
//       <Route
//         path="/management"
//         element={
//           <GymManagementRouteGuard>
//             <GymManageLayout />
//           </GymManagementRouteGuard>
//         }
//       >
//         {/* Dashboard routes with query params */}
//         <Route index element={<GymManageDashboard />} />
//         <Route path="/management/dashboard" element={<GymManageDashboard />} />
        
//         {/* Gym specific routes with query params */}
//         <Route path="/management/edit" element={<GymInfo />} />
//         <Route path="/management/gymlist" element={<GymList />} />
//         <Route path="/management/create" element={<AddGym />} />

//         {/* Boxer routes with query params */}
//         <Route path="/management/boxers/create" element={<AddBoxer />} />
//         <Route path="/management/boxers/list" element={<BoxerList />} />
        
//         {/* Trainer routes with query params */}
//         <Route path="/management/trainers/create" element={<AddTrainer />} />
//         <Route path="/management/trainers/list" element={<TrainerList />} />
        
//         {/* Course routes with query params */}
//         <Route path="/management/courses/create" element={<CreateCourseForm />} />
//       </Route>

//       {/* Course Routes */}
//       <Route path="/editCourseFrom" element={<EditCourseFrom />} />
//       <Route path="/editCourse" element={<EditCourse />} />
//       {/* <Route path="/courseFrom" element={<CourseFrom />} /> */}
//       {/* <Route path="/createCourse" element={<CreateCourse />} /> */}

//       {/* ไม่มี Layout(Navbar) */}
//       <Route path="/forrent" element={<GymForRent />} />
//     </Routes>
//   );
// }

// export default GymRoutes;
