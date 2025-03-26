import React, { useState } from "react";
import CropImageModal from "../../../components/shops/CropImageModal";
import { createTempUser } from "../../../services/api/UserApi";
import { useParams } from "react-router-dom";
import {
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

function AddBoxer() {
  const [boxerData, setBoxerData] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    role: "boxer",
    licence: [],
  });

  const { gym_id } = useParams();
  const [profile, setProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // State สำหรับจัดการรูปภาพใบอนุญาต (ไม่ต้อง crop)
  const [licenceFiles, setLicenceFiles] = useState([]); // เก็บไฟล์ที่เลือก
  const [licencePreviews, setLicencePreviews] = useState([]); // เก็บ URL สำหรับ preview

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
        setPreviewImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // เมื่อการ crop เสร็จสิ้น (สำหรับ profile picture)
  const handleCropDone = (croppedBlob) => {
    setShowCropper(false);
    const croppedFile = new File([croppedBlob], "profile_cropped.png", {
      type: "image/png",
    });
    setProfile(croppedFile);
    const previewUrl = URL.createObjectURL(croppedFile);
    setPreviewImage(previewUrl);
  };

  // จัดการเมื่อมีการเลือกไฟล์สำหรับใบอนุญาต (รองรับการเลือกหลายไฟล์)
  const handleLicenceFileSelect = (e) => {
    const files = Array.from(e.target.files); // แปลง FileList เป็น Array
    if (files.length > 0) {
      const remainingSlots = 5 - licenceFiles.length; // คำนวณจำนวนที่ยังสามารถเพิ่มได้
      if (files.length > remainingSlots) {
        alert(`คุณสามารถอัปโหลดรูปภาพใบอนุญาตได้สูงสุด 5 รูปเท่านั้น (เพิ่มได้อีก ${remainingSlots} รูป)`);
        files.splice(remainingSlots); // ตัดไฟล์ส่วนเกินออก
      }
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setLicenceFiles((prev) => [...prev, ...files]);
      setLicencePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // ลบรูปภาพใบอนุญาต
  const handleRemoveLicence = (index) => {
    setLicenceFiles((prev) => prev.filter((_, i) => i !== index));
    setLicencePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // เมื่อ submit ฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", boxerData.first_name);
    formData.append("last_name", boxerData.last_name);
    formData.append("nickname", boxerData.nickname);
    formData.append("role", boxerData.role);
    formData.append("status", "inActive");

    // Append cropped profile picture ถ้ามี
    if (profile) {
      formData.append("profile_picture_url", profile);
    }

    // Append รูปภาพใบอนุญาต (licence)
    licenceFiles.forEach((file) => {
      formData.append("licence", file);
    });

    // สำหรับ debug: iterate ผ่าน entries ของ formData เพื่อ log ค่า
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await createTempUser(formData);
      console.log("Response from createTempUser:", response);
    } catch (error) {
      console.error("Error creating temp user:", error);
      throw new Error(error);
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
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Cropped Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm text-center">
                    Click to upload Profile
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

          {/* Licence Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Licence Photo 
            </label>
            <div className="space-y-4">
              {/* ถ้ายังไม่มีรูปภาพ ให้แสดงช่องอัปโหลดแบบในรูป */}
              {licenceFiles.length === 0 ? (
                <label
                  htmlFor="licence-upload"
                  className="cursor-pointer w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-rose-400 transition-all"
                >
                  <PhotoIcon className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-gray-500 text-sm">
                    Click to upload licence photos
                  </span>
                  <span className="text-gray-400 text-xs">
                    PNG, JPG up to 5 files
                  </span>
                  <input
                    id="licence-upload"
                    type="file"
                    accept="image/*"
                    multiple // เพิ่ม attribute multiple เพื่อเลือกหลายไฟล์
                    onChange={handleLicenceFileSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <>
                  {/* แสดงรูปภาพที่อัปโหลดแล้วในกรอบ */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {licencePreviews.map((preview, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <img
                            src={preview}
                            alt={`Licence ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveLicence(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* ถ้ายังอัปโหลดไม่ครบ 5 รูป ให้แสดงช่องอัปโหลดเพิ่ม */}
                    {licenceFiles.length < 5 && (
                      <label
                        htmlFor="licence-upload"
                        className="cursor-pointer w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-rose-400 transition-all"
                      >
                        <PhotoIcon className="w-6 h-6 text-gray-500 mb-1" />
                        <span className="text-gray-500 text-sm">
                          Add more licence photos
                        </span>
                        <span className="text-gray-400 text-xs">
                          PNG, JPG up to {5 - licenceFiles.length} more files
                        </span>
                        <input
                          id="licence-upload"
                          type="file"
                          accept="image/*"
                          multiple // เพิ่ม attribute multiple เพื่อเลือกหลายไฟล์
                          onChange={handleLicenceFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>
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

      {/* Crop Image Modal for Profile */}
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