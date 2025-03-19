import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // ใช้ isAdmin จาก AuthContext

  useEffect(() => {
    if (!isAdmin) {
        navigate("/login"); // นำทางไปยังหน้า Login ถ้าไม่ใช่ Admin
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : null;
};

export default AdminRouteGuard;