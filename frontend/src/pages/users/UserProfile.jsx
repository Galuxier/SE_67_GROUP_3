import { useState,useEffect  } from "react";
import { useAuth } from "../../context/AuthContext";
import { BsPersonCircle, BsPencilSquare } from "react-icons/bs";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { updateUser } from "../../services/api/UserApi";


function UserProfile() {
  const { user, setUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        bio: user.bio || "",
        contact: {
          line: user.contact_info?.line || "",
          facebook: user.contact_info?.facebook || ""
        }
      });
    }
  }, [isModalOpen]); 

  // ✅ ใช้ state ให้ตรงกับ API backend
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    contact: {
      line: "",
      facebook: ""
    }
  });
  

  // ✅ ฟังก์ชันอัปเดตค่าใน state เมื่อพิมพ์ข้อมูล
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      // ✅ ตรวจสอบว่าค่าเป็นของ `contact` หรือไม่
      if (["line", "facebook"].includes(name)) {
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [name]: value
          }
        };
      }
  
      // ✅ อัปเดต field ปกติ (first_name, last_name, bio)
      return {
        ...prev,
        [name]: value
      };
    });
  };
  
  
  // ✅ ฟังก์ชันส่งข้อมูลไปอัปเดตในฐานข้อมูล
  const handleSave = async () => {
    try {
      // ✅ กรองเฉพาะค่าใน `contact` ที่จำเป็น
      const cleanedData = {
        ...formData,
        contact_info: {
          line: formData.contact.line || "",
          facebook: formData.contact.facebook || ""
        }
      };
  
      // console.log("Before Save:", JSON.stringify(cleanedData));
      console.log("Before Save:",cleanedData);
      
  
      const response = await updateUser(user._id, cleanedData);
      console.log("Save response:", response);
  
      setUser(response);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <main className="flex justify-center min-h-screen pt-10">
      <section className="w-full h-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mx-auto">
        <div className="flex items-center space-x-6 relative">
        {/* รูปโปรไฟล์ */}
          {user.profile_picture_url ? (
            <img
              alt="Profile"
              src={user.profile_picture_url}
              className="shadow-xl rounded-full h-32 w-32 border-4 border-white"
            />
          ) : (
            <BsPersonCircle className="h-32 w-32 text-gray-400" />
          )}

          {/* ปุ่มแก้ไขโปรไฟล์ */}
          <button
            className="absolute top-0 left-24 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
            onClick={setIsModalOpen}
          >
            <BsPencilSquare className="text-gray-600 h-5 w-5" />
          </button>

          {/* ข้อมูลผู้ใช้ */}
          <div className="flex-1">
            <h3 className="text-3xl font-semibold text-gray-800">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 mt-1">({user.role})</p>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="contact ml-auto bg-gray-100 px-5 py-3 rounded-lg shadow-md max-w-56">
            <p className="text-gray-700 font-semibold">Contact</p>
            <div className="text-gray-600 text-sm whitespace-pre-line">
              <p>Email: {user.email || "-"}</p>
              <p>Phone: {user.phone || "-"}</p>
              <p>Line: {user.contact_info?.line || "-"}</p>
              <p>Facebook: {user.contact_info?.facebook || "-"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-left">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Biography</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {user.bio || "No biography available."}
          </p>
        </div>
      </section>

      {/* ✅ Modal สำหรับแก้ไขโปรไฟล์ */}
      {isModalOpen && (
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
          
          {/* ช่องกรอกข้อมูลติดต่อ */}
          <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Contact</label>
                <div className="space-y-4">

                  {/* Line ID */}
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

                  {/* Facebook */}
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