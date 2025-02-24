import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from './pages/home';
import CourseHome from './pages/courses/CourseHome';
import GymHome from "./pages/gyms/GymHome";
import EventHome from "./pages/events/EventHome";
import ShopHome from "./pages/shops/ShopHome";
import UserProfile from "./pages/users/UserProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route index element={<CourseHome />} />
          <Route path="gym" element={<GymHome />} />
          <Route path="event" element={<EventHome />} />
          <Route path="shop" element={<ShopHome />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
