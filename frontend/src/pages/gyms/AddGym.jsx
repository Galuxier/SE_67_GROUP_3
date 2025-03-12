import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PaperClipIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CreateGym } from "../../services/api/GymApi";
import AddressForm from "../../components/AddressForm";

const Addgym = () => {
  const [fileSelected, setFileSelected] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]); // สำหรับแสดงรูปภาพที่อัปโหลด
  const [gymData, setGymData] = useState({
    gym_name: "",
    description: "",
    contact: {
      email: "",
      tel: "",
      line: "",
      facebook: "",
    },
    gym_image_urls: [], // เก็บไฟล์รูปภาพ
    address: {},
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files); // แปลง FileList เป็นอาร์เรย์

      // ตรวจสอบจำนวนรูปภาพไม่เกิน 10 รูป
      if (files.length + filePreviews.length > 10) {
        alert("You can upload a maximum of 10 images.");
        return;
      }

      const previews = files.map((file) => URL.createObjectURL(file)); // สร้าง URL สำหรับแสดงรูปภาพ
      setFilePreviews((prev) => [...prev, ...previews]);
      setFileSelected(true);
      setGymData((prev) => ({
        ...prev,
        gym_image_urls: [...prev.gym_image_urls, ...files],
      })); // เก็บไฟล์ทั้งหมดใน state
    } else {
      setFilePreviews([]);
      setFileSelected(false);
    }
  };

  // ฟังก์ชันลบรูปภาพ
  const handleRemoveImage = (index) => {
    const newPreviews = [...filePreviews];
    const newFiles = [...gymData.gym_image_urls];

    newPreviews.splice(index, 1); // ลบรูปภาพจาก previews
    newFiles.splice(index, 1); // ลบไฟล์จาก state

    setFilePreviews(newPreviews);
    setGymData((prev) => ({
      ...prev,
      gym_image_urls: newFiles,
    }));

    if (newPreviews.length === 0) {
      setFileSelected(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGymData({ ...gymData, [name]: value });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setGymData({
      ...gymData,
      contact: {
        ...gymData.contact,
        [name]: value,
      },
    });
  };

  const handleAddressChange = (address) => {
    setGymData((prev) => ({ ...prev, address }));
  };

  const handleBack = async () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gymData.contact.email || !gymData.contact.tel) {
      alert("Please fill in all required fields (Email and Tel).");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const owner_id = user?._id;

      if (!owner_id) {
        throw new Error("User not found in localStorage");
      }

      const formData = new FormData();
      formData.append("owner_id", owner_id);
      formData.append("gym_name", gymData.gym_name);
      formData.append("description", gymData.description);
      formData.append("contact", JSON.stringify(gymData.contact));
      formData.append("address", JSON.stringify(gymData.address));

      // เพิ่มไฟล์รูปภาพทั้งหมดลงใน FormData
      gymData.gym_image_urls.forEach((file, index) => {
        formData.append("gym_images", file); // ใช้ชื่อ "gym_images" เพื่อให้ Multer จัดการ
      });
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // console.log(formData);
      const response = await CreateGym(formData); // ส่ง FormData ไปยัง API
      console.log("Create Gym Successful:", response);
      navigate("/gym");
    } catch (error) {
      console.error("Create Gym Failed:", error);
    }
  };

  const Back = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 pb-10">
      <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 text-lg font-semibold"
          >
            &larr; Back
          </button>
          <h1 className="text-3xl font-semibold py-2">Add Gym</h1>
          <div className="w-20"></div>
        </div>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit}>
          {/* ชื่อโรงยิม */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              name="gym_name"
              value={gymData.gym_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
              placeholder="Enter gym name"
              required
            />
          </div>

          {/* คำอธิบาย */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={gymData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
              placeholder="Enter gym description"
              rows="4"
              required
            />
          </div>

          {/* ช่องกรอกข้อมูลติดต่อ */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact</label>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={gymData.contact.email}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter email (Required)"
                  required
                />
              </div>

              {/* Tel */}
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Tel:</label>
                <input
                  type="tel"
                  name="tel"
                  value={gymData.contact.tel}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter telephone number (Required)"
                  required
                />
              </div>

              {/* Line ID */}
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Line ID:</label>
                <input
                  type="text"
                  name="line"
                  value={gymData.contact.line}
                  onChange={handleContactChange}
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
                  value={gymData.contact.facebook}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter Facebook (Optional)"
                />
              </div>
            </div>
          </div>

          {/* อัปโหลดรูปภาพ */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Photos</label>
            <div className="relative w-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                id="fileInput"
                accept="image/*"
                multiple // อนุญาตให้เลือกหลายไฟล์
              />
              <button
                className="w-full border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-between cursor-default"
              >
                <span className="text-gray-500 truncate pointer-events-none">
                  {fileSelected ? "Files selected" : "Choose files"}
                </span>
                <PaperClipIcon
                  onClick={handleIconClick}
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                />
              </button>
            </div>
            {/* แสดงรูปภาพที่อัปโหลด */}
            <div className="mt-4 flex flex-wrap gap-2">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  {/* ปุ่ม X เพื่อลบรูปภาพ */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ตำแหน่งที่ตั้ง */}
          <AddressForm
            onChange={handleAddressChange}
          />

          {/* สิ่งอำนวยความสะดวก */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Facilities</label>
            <div className="flex justify-center items-center">
              <button className="px-4 py-2 text-black">
                <PlusCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* ปุ่ม Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-rose-600 border rounded-lg py-2 px-4 focus:outline-none hover:bg-rose-700 transition-colors"
            >
              <span className="text-white text-lg font-semibold">Add Gym</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addgym;
