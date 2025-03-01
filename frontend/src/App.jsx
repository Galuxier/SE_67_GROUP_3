import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";

import Home from './pages/Home';
import Signup from './pages/Register';
import Login from './pages/Login';

import GymRoutes from "./routes/GymRoute";
import CourseRoutes from "./routes/CourseRoute";
import EventRoutes from "./routes/EventRoute";
import ShopRoutes from "./routes/ShopRoute";
import UserRoutes from "./routes/UserRoute";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes ที่ใช้ MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Routes ที่ไม่มี Layout (Login/Signup) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          {/* ใช้ Component ของแต่ละหมวด */}
          <Route path="/gym/*" element={<GymRoutes />} />
          <Route path="/course/*" element={<CourseRoutes />} />
          <Route path="/event/*" element={<EventRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/shop/*" element={<ShopRoutes />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
