import { useState, useEffect, useRef } from "react";
import { PlusCircleIcon, PaperClipIcon } from "@heroicons/react/24/outline";

const EditGymModal = ({ isOpen, onClose, gymData, onSave }) => {
  const [editedGym, setEditedGym] = useState(gymData || {});
  const fileInputRef = useRef(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");

  // ✅ โหลดข้อมูลเดิมเมื่อ Modal เปิด
  useEffect(() => {
    if (gymData) {
      setEditedGym(gymData);
    }
  }, [gymData]);

  if (!isOpen) return null; // ❌ ถ้า Modal ปิด ไม่ต้องแสดงอะไร

  // ✅ ฟังก์ชันอัปเดตค่าทั่วไป (ชื่อ, รายละเอียด ฯลฯ)
  const handleChange = (e) => {
    setEditedGym({ ...editedGym, [e.target.name]: e.target.value });
  };

  // ✅ ฟังก์ชันอัปเดตค่าของ contact
  const handleContactChange = (e) => {
    setEditedGym({
      ...editedGym,
      contact: {
        ...editedGym.contact,
        [e.target.name]: e.target.value,
      },
    });
  };

  // ✅ ฟังก์ชันอัปเดตค่าของ address
  const handleAddressChange = (e) => {
    setEditedGym({
      ...editedGym,
      address: {
        ...editedGym.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  // ✅ ฟังก์ชันอัปโหลดรูปภาพ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
      setEditedGym({ ...editedGym, photo: file });
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // ✅ เมื่อกดบันทึก
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedGym); // ส่งข้อมูลกลับไป
    onClose(); // ปิด Modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Edit Gym</h2>
        <hr className="mbb-6"/>

        <form onSubmit={handleSubmit}>
          {/* ✅ ชื่อโรงยิม */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              name="gym_name"
              value={editedGym.gym_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* ✅ คำอธิบาย */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={editedGym.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
              rows="4"
              required
            />
          </div>

          {/* ✅ ข้อมูลติดต่อ */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact</label>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedGym.contact?.email || ""}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Tel:</label>
                <input
                  type="tel"
                  name="tel"
                  value={editedGym.contact?.tel || ""}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  required
                />
              </div>
            </div>
          </div>

          {/* ✅ ตำแหน่งที่ตั้ง */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Location</label>
            <div className="space-y-4">
              {["province", "district", "subdistrict", "postal_code", "latitude", "longitude", "information"].map(
                (field) => (
                  <div key={field} className="flex items-center">
                    <label className="w-24 text-gray-700 capitalize">{field.replace("_", " ")}:</label>
                    <input
                      type="text"
                      name={field}
                      value={editedGym.address?.[field] || ""}
                      onChange={handleAddressChange}
                      className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
                      required
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* ✅ สิ่งอำนวยความสะดวก (Facilities) */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Facilities</label>
            <textarea
              name="facilities"
              value={editedGym.facilities || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
              rows="2"
              placeholder="List gym facilities separated by commas"
            />
          </div>

          {/* ✅ ปุ่มบันทึก */}
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-gray-400 rounded" type="button" onClick={onClose}>
              ยกเลิก
            </button>
            <button className="px-4 py-2 bg-rose-600 text-white rounded" type="submit">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGymModal;
