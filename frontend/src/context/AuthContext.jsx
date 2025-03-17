import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]); // เพิ่ม state สำหรับ roles

  // ฟังก์ชัน login
  const login = async (token) => {
    const userData = jwtDecode(token); // ถอดรหัส JWT Token
    console.log("Auth Context Decode Data: ", userData);
    
    const userRoles = userData.role; // ดึง roles จาก Token (เป็น Array)
    console.log("Auth Context userRoles: ",userRoles);

    setIsLoggedIn(true);
    setUser(userData);
    setRoles(userRoles); // ตั้งค่า roles
    
    localStorage.setItem("token", token); // บันทึก token ใน localStorage
    localStorage.setItem("user", JSON.stringify(userData)); // บันทึกข้อมูลผู้ใช้ใน localStorage
    localStorage.setItem("isLoggedIn", "true"); // บันทึกสถานะการล็อกอินใน localStorage
  
    return userRoles; // Return roles เพื่อให้สามารถรอการอัปเดต state ได้
  };

  // ฟังก์ชัน logout
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setRoles([]); // ลบ roles

    localStorage.removeItem("token"); // ลบ token จาก localStorage
    localStorage.removeItem("user"); // ลบข้อมูลผู้ใช้จาก localStorage
    localStorage.removeItem("isLoggedIn"); // ลบสถานะการล็อกอินจาก localStorage
  };

  // โหลดข้อมูลจาก localStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedToken && storedUser && storedIsLoggedIn === "true") {
      const userData = JSON.parse(storedUser);
      const userRoles = userData.role || []; // ดึง roles จากข้อมูลผู้ใช้

      setUser(userData);
      setRoles(userRoles); // ตั้งค่า roles
      setIsLoggedIn(true);
    }
  }, []);

  // ตรวจสอบ roles และส่งค่าไปยัง context
  const isAdmin = roles.includes("admin"); // ตรวจสอบว่าผู้ใช้มี role เป็น admin หรือไม่
  
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        roles,
        isAdmin, // ส่งค่า isAdmin ไปยัง context
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}