/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../../services/api/UserApi"; // นำเข้า getUserProfile
import { useAuth } from "../../context/AuthContext";
import { verifyPassword } from "../../services/api/AuthApi";

function Authenticator({ isOpen, onClose, onVerify, setIsLoading }) {
  const { users } = useAuth();
  const { username } = useParams();  // ดึง username จาก URL
  const [user, setUser] = useState(null);  // ข้อมูลโปรไฟล์ผู้ใช้
  const [password, setPassword] = useState("");  // รหัสผ่านที่กรอก
  const [errorMessage, setErrorMessage] = useState("");  // ข้อความข้อผิดพลาด
  const [loading, setLoading] = useState(false);  // สถานะการโหลด

  // ดึงข้อมูลโปรไฟล์ของผู้ใช้เมื่อเปิด Modal
  useEffect(() => {
    if (isOpen) {
      const fetchUserProfile = async () => {
        try {
          const profileData = await getUser(users._id); // เรียก API เพื่อดึงข้อมูลโปรไฟล์
          setUser(profileData);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    }
  }, [isOpen, users]);

  // ฟังก์ชันสำหรับกรอกรหัสผ่าน
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // ฟังก์ชันตรวจสอบรหัสผ่านเมื่อกด Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    try {
      // ตรวจสอบรหัสผ่าน
      const isVerified = true;  // สมมุติว่ารหัสผ่านถูกต้อง
      if (isVerified) {
        onVerify(true); // ถ้ารหัสผ่านถูกต้อง
        onClose(); // ปิด Modal
        console.log("verify success");
      } else {
        setErrorMessage("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };
  // ฟังก์ชันสำหรับตรวจสอบรหัสผ่านจาก API
//   const verifyPassword = async (password) => {
//     try {
//       const profile = await getUserProfile(username); // ดึงข้อมูลโปรไฟล์จาก API
//       return profile.password === password; // เปรียบเทียบรหัสผ่าน
//     } catch (error) {
//       console.error("Error verifying password:", error);
//       return false; // ถ้าล้มเหลวจะถือว่าไม่ถูกต้อง
//     }
//   };

  if (!isOpen) return null; // ถ้า Modal ไม่เปิด จะไม่แสดงอะไร

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-text ">Enter Your Password</h2>

        {/* แสดงข้อมูลโปรไฟล์ผู้ใช้
        {user && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">User Information</h3>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        )} */}

        {/* ฟอร์มกรอกรหัสผ่าน */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-medium mb-2 text-black dark:text-text">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 border dark:bg-background text-black dark:text-text border-gray-300 rounded-lg"
              required
            />
          </div>

          {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose(); // ปิด Modal เมื่อกด Cancel
                setIsLoading(false); // หยุดการโหลดใน ProfileEditModal
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-rose-600 text-white dark:text-text rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Authenticator;
