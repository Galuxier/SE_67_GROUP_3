import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext"; // นำเข้า ThemeProvider
import LoadingSpinner from "./components/LoadingSpinner"; // นำเข้า LoadingSpinner
import 'swiper/swiper-bundle.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// // Lazy load pages
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Signup = lazy(() => import("./pages/Register"));
// import Ticket from "./pages/Ticket";


// // Lazy load routes
// const GymRoutes = lazy(() => import("./routes/GymRoute"));
// const CourseRoutes = lazy(() => import("./routes/CourseRoute"));
// const EventRoutes = lazy(() => import("./routes/EventRoute"));
// const ShopRoutes = lazy(() => import("./routes/ShopRoute"));
// const UserRoutes = lazy(() => import("./routes/UserRoute"));
// const AdminRoutes = lazy(() => import("./routes/AdminRoute"));

// Import pages normally
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ticket from "./pages/Ticket";
import ProfileSetup from "./pages/ProfileSetup";
import ContactPage from "./pages/ContactPage";

// Import routes normally
import GymRoutes from "./routes/GymRoute";
import CourseRoutes from "./routes/CourseRoute";
import EventRoutes from "./routes/EventRoute";
import ShopRoutes from "./routes/ShopRoute";
import UserRoutes from "./routes/UserRoute";
import AdminRoutes from "./routes/AdminRoute";
// import AdminRouteGuard from "./routes/guards/AdminRouteGuard";
import { PlaceManagementRouteGuard, AdminRouteGuard } from "./routes/guards/RouteGuard";

import PlaceManageLayout from "./layouts/PlaceManageLayout";
import PlaceManageDashboard from "./pages/places/managements/PlaceManageDashboard";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      {/* Wrap ทั้งแอปด้วย ThemeProvider */}
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Routes ที่ใช้ MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Routes ที่ไม่มี Layout (Login/Signup) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/ticket" element={<Ticket />} />

              {/* ใช้ Component ของแต่ละหมวด */}
              <Route path="/gym/*" element={<GymRoutes />} />
              <Route path="/course/*" element={<CourseRoutes />} />
              <Route path="/event/*" element={<EventRoutes />} />
              <Route path="/user/*" element={<UserRoutes />} />
              <Route path="/shop/*" element={<ShopRoutes />} />
              {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}

              {/* ใช้ AdminRouteGuard เพื่อป้องกันหน้า Admin */}
              <Route
                path="/admin/*"
                element={
                  <AdminRouteGuard>
                    <AdminRoutes />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/place/management/*"
                element={
                  <PlaceManagementRouteGuard>
                    <PlaceManageLayout />
                  </PlaceManagementRouteGuard>
                }
              >
                <Route index element={<PlaceManageDashboard />} />
                {/* Add other place management routes here */}
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;