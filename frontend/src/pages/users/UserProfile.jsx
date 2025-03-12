import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import { BsPersonCircle, BsPencilSquare } from "react-icons/bs";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { getUserProfile, updateUser } from "../../services/api/UserApi"; 
import { ClipLoader } from "react-spinners";

function UserProfile() {
  const { user } = useAuth(); // user ที่ล็อกอินอยู่
  const { username }  = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null); // state สำหรับข้อมูลผู้ใช้ที่กำลังดู

  // ตรวจสอบว่าเป็นโปรไฟล์ของตัวเองหรือไม่
  const isCurrentUserProfile = user?.username === username;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true); // เริ่มโหลด
        const response = await getUserProfile(username);
        
        // อัปเดต state สำหรับข้อมูลผู้ใช้ที่กำลังดู
        setProfileUser(response);
        setFormData({
          first_name: response.first_name || "",
          last_name: response.last_name || "",
          bio: response.bio || "",
          contact: {
            line: response.contact_info?.line || "",
            facebook: response.contact_info?.facebook || ""
          }
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
      } finally {
        setIsLoading(false); // หยุดโหลดไม่ว่าจะสำเร็จหรือไม่
      }
    };
  
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    contact: {
      line: "",
      facebook: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (["line", "facebook"].includes(name)) {
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [name]: value
          }
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSave = async () => {
    try {
      const cleanedData = {
        ...formData,
        contact_info: {
          line: formData.contact.line || "",
          facebook: formData.contact.facebook || ""
        }
      };

      const response = await updateUser(user._id, cleanedData);
      console.log("Save response:", response);

      // อัปเดตข้อมูลผู้ใช้ที่ล็อกอิน
      setProfileUser(response);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <main className="flex justify-center min-h-screen pt-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#4F46E5" size={50} />
        </div>
      ) : error ? (
        <section className="w-full h-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mx-auto">
          <h3 className="text-2xl text-red-600 font-semibold text-center">{error}</h3>
        </section>
      ) : (
        <section className="w-full h-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mx-auto">
          <div className="flex items-center space-x-6 relative">
            {profileUser?.profile_picture_url ? (
              <img
                alt="Profile"
                src={profileUser?.profile_picture_url}
                className="shadow-xl rounded-full h-32 w-32 border-4 border-white"
              />
            ) : (
              <BsPersonCircle className="h-32 w-32 text-gray-400" />
            )}

            {/* แสดงปุ่ม Edit เฉพาะเมื่อเป็นโปรไฟล์ของตัวเอง */}
            {isCurrentUserProfile && (
              <button
                className="absolute top-0 left-24 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(true)}
              >
                <BsPencilSquare className="text-gray-600 h-5 w-5" />
              </button>
            )}

            <div className="flex-1">
              <h3 className="text-3xl font-semibold text-gray-800">
                {profileUser?.first_name} {profileUser?.last_name}
              </h3>
              <p className="text-gray-600 mt-1">({profileUser?.role})</p>
            </div>

            <div className="contact ml-auto bg-gray-100 px-5 py-3 rounded-lg shadow-md max-w-56">
              <p className="text-gray-700 font-semibold">Contact</p>
              <div className="text-gray-600 text-sm whitespace-pre-line">
                <p>Email: {profileUser?.email || "-"}</p>
                <p>Phone: {profileUser?.phone || "-"}</p>
                <p>Line: {profileUser?.contact_info?.line || "-"}</p>
                <p>Facebook: {profileUser?.contact_info?.facebook || "-"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-left">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Biography</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {profileUser?.bio || "No biography available."}
            </p>
          </div>
        </section>
      )}

      {/* Modal สำหรับแก้ไขโปรไฟล์ (แสดงเฉพาะเมื่อเป็นโปรไฟล์ของตัวเอง) */}
      {isCurrentUserProfile && isModalOpen && (
        <Modal title="Edit Profile" onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-row gap-x-4 mt-6">
            <div className="w-1/2">
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-900">
                First name
              </label>
              <input
                value={formData.first_name}
                name="first_name"
                type="text"
                placeholder="First name"
                onChange={handleChange}
                className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-900">
                Last name
              </label>
              <input
                value={formData.last_name}
                name="last_name"
                type="text"
                placeholder="Last name"
                onChange={handleChange}
                className="mt-1 py-1 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact</label>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Line ID:</label>
                <input
                  type="text"
                  name="line"
                  value={formData.contact.line}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter Line ID (Optional)"
                />
              </div>

              <div className="flex items-center">
                <label className="w-24 text-gray-700">Facebook:</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.contact.facebook}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter Facebook (Optional)"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-900">
              Bio
            </label>
            <textarea
              value={formData.bio}
              name="bio"
              placeholder="Enter your bio..."
              rows={4}
              onChange={handleChange}
              className="mt-1 py-2 px-3 block w-full rounded-md border border-gray-300 focus:border-pink-600 focus:ring-1 focus:ring-pink-300 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleSave}>Save</Button>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default UserProfile;