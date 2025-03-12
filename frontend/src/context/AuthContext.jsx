import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // ฟังก์ชัน login
  const login = (token) => {
    const userData = jwtDecode(token);
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // บันทึกข้อมูลผู้ใช้ใน localStorage
    localStorage.setItem("isLoggedIn", "true"); // บันทึกสถานะการล็อกอินใน localStorage
  };

  // ฟังก์ชัน logout
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);  
    localStorage.removeItem("user"); 
    localStorage.removeItem("isLoggedIn"); 
  };

  // โหลดข้อมูลจาก localStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  if (user) {
    console.log(user);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}