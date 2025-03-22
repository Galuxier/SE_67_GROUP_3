import React, { useState } from "react";
import CropImageModal from "../../../components/shops/CropImageModal";

function AddBoxer() {
  const [boxerData, setBoxerData] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    role: "boxer",
  });

  // เพิ่ม state สำหรับเก็บไฟล์ที่ผ่านการ crop และ preview image
  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // จัดการเมื่อมีการเปลี่ยนแปลงข้อมูลใน input text
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBoxerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // จัดการเมื่อมีการเลือกไฟล์สำหรับ profile picture
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // setPreviewImage จะใช้แสดงตัวอย่างก่อน crop
        setPreviewImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // เมื่อการ crop เสร็จสิ้น (รับ cropped blob จาก CropImageModal)
  const handleCropDone = (croppedBlob) => {
    setShowCropper(false);
    // สร้าง File object จาก blob ที่ crop แล้ว
    const croppedFile = new File([croppedBlob], "profile_cropped.png", {
      type: "image/png",
    });
    setProfile(croppedFile);
    // สร้าง URL สำหรับแสดงผล preview จาก cropped file
    const previewUrl = URL.createObjectURL(croppedFile);
    setPreviewImage(previewUrl);
  };

  // เมื่อ submit ฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", boxerData.first_name);
    formData.append("last_name", boxerData.last_name);
    formData.append("nickname", boxerData.nickname);
    formData.append("role", boxerData.role);

    // Append cropped profile picture ถ้ามี
    if (profile) {
      formData.append("profile_picture_url", profile);
    }

    // สำหรับ debug: iterate ผ่าน entries ของ formData เพื่อ log ค่า
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background pt-10 pb-10">
      <div className="w-full max-w-2xl p-8 shadow-lg bg-card rounded-lg overflow-y-auto border border-border/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="flex justify-center mb-6">
              <label
                htmlFor="profile-upload"
                className="cursor-pointer w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-rose-400 transition-all"
              >
                {profile ? (
                  <img
                    src={previewImage}
                    alt="Cropped Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm text-center">
                    Click to upload logo
                  </span>
                )}
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={boxerData.first_name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={boxerData.last_name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter last name"
              required
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              value={boxerData.nickname}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter nickname"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={boxerData.role}
              readOnly
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              Add Boxer
            </button>
          </div>
        </form>
      </div>

      {/* Crop Image Modal */}
      {showCropper && (
        <CropImageModal
          show={showCropper}
          onClose={() => setShowCropper(false)}
          file={tempFile}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  );
}

export default AddBoxer;
