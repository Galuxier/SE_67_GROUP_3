import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext"; // นำเข้า ThemeProvider
import LoadingSpinner from "./components/LoadingSpinner"; // นำเข้า LoadingSpinner

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Register"));
import Ticket from "./pages/Ticket";


// Lazy load routes
const GymRoutes = lazy(() => import("./routes/GymRoute"));
const CourseRoutes = lazy(() => import("./routes/CourseRoute"));
const EventRoutes = lazy(() => import("./routes/EventRoute"));
const ShopRoutes = lazy(() => import("./routes/ShopRoute"));
const UserRoutes = lazy(() => import("./routes/UserRoute"));
const AdminRoutes = lazy(() => import("./routes/AdminRoute"));


const App = () => {
  return (
    <Router>
      {/* Wrap ทั้งแอปด้วย ThemeProvider */}
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Routes ที่ใช้ MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Routes ที่ไม่มี Layout (Login/Signup) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
          {/* Routes ที่ไม่มี Layout (Login/Signup) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ticket" element={<Ticket/>} />

              {/* ใช้ Component ของแต่ละหมวด */}
              <Route path="/gym/*" element={<GymRoutes />} />
              <Route path="/course/*" element={<CourseRoutes />} />
              <Route path="/event/*" element={<EventRoutes />} />
              <Route path="/user/*" element={<UserRoutes />} />
              <Route path="/shop/*" element={<ShopRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;