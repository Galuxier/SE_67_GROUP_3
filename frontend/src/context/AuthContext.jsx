import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserRoles } from "../services/api/UserApi"; // นำเข้า getUserRoles จาก UserApi

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // null หมายถึง guest
  const [roles, setRoles] = useState([]);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [loading, setLoading] = useState(true); // เพิ่ม loading state

  // ฟังก์ชัน sync roles กับ API
  const syncRoles = async (userId) => {
    try {
      const response = await getUserRoles(userId);
      const fetchedRoles = response.data.data.roles || []; // ปรับตามโครงสร้าง response
      
      setRoles(fetchedRoles);
      return fetchedRoles;
    } catch (error) {
      console.error("Failed to sync roles:", error);
      setRoles([]); // ถ้า sync ไม่ได้ ตั้ง roles เป็น array ว่าง
      return [];
    }
  };

  // ฟังก์ชัน login
  const login = async (token) => {
    try {
      console.log(token);
      const userData = jwtDecode(token);
      // console.log("Auth Context Decode Data: ", userData);

      if (userData.exp * 1000 < Date.now()) {
        console.log("Token หมดอายุแล้ว");
        logout(true);
        return;
      }

      setIsLoggedIn(true);
      setUser(userData);

      // เก็บ token และ user ใน localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");

      // Sync roles กับ API แทนการใช้จาก JWT
      const userRoles = await syncRoles(userData._id); // สมมติว่า _id อยู่ใน JWT
      return userRoles;
    } catch (error) {
      console.error("Invalid token:", error);
      logout(true);
    }
  };

  // ฟังก์ชัน logout
  const logout = (expired = false) => {
    setIsLoggedIn(false);
    setUser(null);
    setRoles([]);
    setIsSessionExpired(expired);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    if (expired) {
      alert("Session หมดอายุ กรุณา login ใหม่");
    }
    window.location.href = "/login";
  };

  // โหลดข้อมูลจาก localStorage และ sync roles เมื่อเริ่มต้น
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

      if (storedToken && storedUser && storedIsLoggedIn === "true") {
        try {
          const userData = JSON.parse(storedUser);
          const decoded = jwtDecode(storedToken);

          if (decoded.exp * 1000 < Date.now()) {
            console.log("Token หมดอายุแล้ว");
            logout(true);
            return;
          }

          setUser(userData);
          setIsLoggedIn(true);

          // Sync roles กับ API
          const userRoles = await syncRoles(userData._id); // ใช้ _id จาก JWT
          setRoles(userRoles);
        } catch (error) {
          console.error("Failed to load user:", error);
          logout(true);
        }
      }
      setLoading(false); // เสร็จสิ้นการโหลด
    };

    initializeAuth();
  }, []);

  // ตรวจสอบ roles
  const isAdmin = roles.includes("admin");

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        roles,
        isAdmin,
        login,
        logout,
        setUser,
        loading,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}