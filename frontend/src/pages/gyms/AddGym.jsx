import "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
// import { MapPinIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { CreateGym } from "../../services/api/GymApi";

const Addgym = () => {
  const nevigate = useNavigate();
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [gymData, setGymData] = useState({
    gym_name: "",
    description: "",
    contact: {
      email: "",
      tel: "",
      line: "",
      facebook: "",
    },
    photo: null,
    address: {
      province: "",
      district: "",
      subdistrict: "",
      postal_code: "",
      latitude: "",
      longitude: "",
      information: "",
    },
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFileSelected(true);
      setGymData({ ...gymData, photo: e.target.files[0] });
    } else {
      setFileName("");
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setGymData({
      ...gymData,
      address: {
        ...gymData.address,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าฟิลด์ required กรอกครบหรือไม่
    if (!gymData.contact.email || !gymData.contact.tel) {
      alert("Please fill in all required fields (Email and Tel).");
      return;
    }

    try {
      // ดึงข้อมูลผู้ใช้จาก localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const owner_id = user?._id;

      if (!owner_id) {
        throw new Error("User not found in localStorage");
      }

      // สร้างข้อมูล gym
      const gymDataToSend = {
        owner_id,
        gym_name: gymData.gym_name,
        description: gymData.description,
        contact: gymData.contact,
        photo: gymData.photo,
        address: gymData.address, // ส่ง address ไปด้วย
      };

      // เรียกใช้ฟังก์ชัน CreateGym จาก GymApi
      const response = await CreateGym(gymDataToSend);
      console.log("Create Gym Successful:", response);

      // Redirect ไปที่หน้า /gym เมื่อสำเร็จ
      navigate("/gym");
    } catch (error) {
      console.error("Create Gym Failed:", error);
    }
  };

  const Back = () => {
    navigate(-1);
  };

  return (
    <div className="relative h-screen">
      <button
        onClick={Back}
        className="px-4 py-2 bg-rose-600 text-white rounded absolute"
      >
        Back
      </button>
      <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 pb-10">
        <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md overflow-y-auto">
          <h1 className="text-3xl block text-center font-semibold py-2">
            Add Gym
          </h1>
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
              <label className="block text-lg font-medium mb-2">
                Description
              </label>
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
              <label className="block text-lg font-medium mb-2">Photo</label>
              <div className="relative w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  id="fileInput"
                  accept="image/*"
                />
                <button className="w-full border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-between cursor-default">
                  <span className="text-gray-500 truncate pointer-events-none">
                    {fileSelected ? fileName : "Choose a file"}
                  </span>
                  <PaperClipIcon
                    onClick={handleIconClick}
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                  />
                </button>
              </div>
            </div>

            {/* ตำแหน่งที่ตั้ง */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Location</label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">Province:</label>
                  <input
                    type="text"
                    name="province"
                    value={gymData.address.province}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter province"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">District:</label>
                  <input
                    type="text"
                    name="district"
                    value={gymData.address.district}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter district"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">Subdistrict:</label>
                  <input
                    type="text"
                    name="subdistrict"
                    value={gymData.address.subdistrict}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter subdistrict"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">Postal Code:</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={gymData.address.postal_code}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter postal code"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">Latitude:</label>
                  <input
                    type="number"
                    name="latitude"
                    value={gymData.address.latitude}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter latitude"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">Longitude:</label>
                  <input
                    type="number"
                    name="longitude"
                    value={gymData.address.longitude}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter longitude"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-24 text-gray-700">Information:</label>
                  <input
                    type="text"
                    name="information"
                    value={gymData.address.information}
                    onChange={handleAddressChange}
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                    placeholder="Enter additional information"
                  />
                </div>
              </div>
            </div>

            {/* สิ่งอำนวยความสะดวก */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Facilities
              </label>
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
                <span className="text-white text-lg font-semibold">
                  Add Gym
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addgym;
