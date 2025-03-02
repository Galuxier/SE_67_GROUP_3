import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลผู้ใช้

  // ฟังก์ชัน login
  const login = (userData) => {
    setIsLoggedIn(true); // อัปเดตสถานะการล็อกอิน
    setUser(userData); // บันทึกข้อมูลผู้ใช้
  };

  // ฟังก์ชัน logout
  const logout = () => {
    setIsLoggedIn(false); // อัปเดตสถานะการล็อกอิน
    setUser(null); // ลบข้อมูลผู้ใช้
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 