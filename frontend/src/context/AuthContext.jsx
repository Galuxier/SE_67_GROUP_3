import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserRoles } from "../services/api/UserApi";
import { getImage } from "../services/api/ImageApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // null หมายถึง guest
  const [roles, setRoles] = useState([]);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชัน sync roles กับ API
  const syncRoles = async (userId) => {
    try {
      const response = await getUserRoles(userId);
      const fetchedRoles = response.data.data.roles || [];
      setRoles(fetchedRoles);
      return fetchedRoles;
    } catch (error) {
      console.error("Failed to sync roles:", error);
      setRoles([]);
      return [];
    }
  };

  // ฟังก์ชันโหลด profile picture
  const loadProfilePicture = async (profilePictureUrl) => {
    if (!profilePictureUrl) return null;
    try {
      const imageData = await getImage(profilePictureUrl);
      return imageData; // สมมติว่าเป็น URL หรือ base64 string
    } catch (error) {
      console.error("Failed to load profile picture:", error);
      return null;
    }
  };

  // ฟังก์ชัน login
  const login = async (token) => {
    try {
      // console.log(token);
      const userData = jwtDecode(token);

      if (userData.exp * 1000 < Date.now()) {
        console.log("Token หมดอายุแล้ว");
        logout(true);
        return;
      }

      // โหลด profile picture ถ้ามี URL
      const profilePicture = userData.profile_picture_url 
        ? await loadProfilePicture(userData.profile_picture_url)
        : null;

      // เพิ่ม profilePicture เข้าไปใน userData
      const updatedUserData = {
        ...userData,
        profile_picture: profilePicture // เปลี่ยนชื่อเป็น profile_picture แทน profile_picture_url
      };
      console.log(updatedUserData);
      
      
      setIsLoggedIn(true);
      setUser(updatedUserData);
      // console.log(user._id);

      // เก็บ token และ user ใน localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      localStorage.setItem("isLoggedIn", "true");

      // Sync roles กับ API
      const userRoles = await syncRoles(userData._id);
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

          // ถ้าไม่มี profile_picture ใน stored data แต่มี profile_picture_url ให้โหลดใหม่
          let updatedUserData = userData;
          if (!userData.profile_picture && userData.profile_picture_url) {
            const profilePicture = await loadProfilePicture(userData.profile_picture_url);
            updatedUserData = {
              ...userData,
              profile_picture_url: profilePicture
            };
            localStorage.setItem("user", JSON.stringify(updatedUserData));
          }

          setUser(updatedUserData);
          setIsLoggedIn(true);

          // Sync roles กับ API
          const userRoles = await syncRoles(userData._id);
          setRoles(userRoles);
        } catch (error) {
          console.error("Failed to load user:", error);
          logout(true);
        }
      }
      setLoading(false);
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