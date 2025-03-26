import React, { useState, useEffect, useRef } from "react";
import { getUserProfile, updateUser, getUser } from "../../services/api/UserApi";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import Authenticator from "../../components/users/Authenticator";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";

function Setting() {
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [editFields, setEditFields] = useState({
    username: false,
    email: false,
    phone: false,
    birthday: false,
    weight: false,
  });
  const [verifiedFields, setVerifiedFields] = useState({
    username: false,
    email: false,
    phone: false,
    birthday: false,
    weight: false,
  });
  const [currentField, setCurrentField] = useState(null);
  const { user } = useParams();
  // console.log("_id", JSON.parse(user._id));
  
  const birthdayInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [croppedPreview, setCroppedReview] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // เพิ่ม state สำหรับการอัปโหลด

  useEffect(() => {
    const fetchSettingData = async () => {
      try {
        // console.log(user.username);
        
        const settingData = await getUser(user._id);
        setSetting(settingData);
        setImage(settingData.profile_picture_url || defaultAvatar);
        setLoading(false);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setLoading(false);
      }
    };

    fetchSettingData();
  }, []);

  useEffect(() => {
    if (verifiedFields.birthday && birthdayInputRef.current) {
      try {
        birthdayInputRef.current.showPicker();
      } catch (error) {
        console.error("ไม่สามารถเปิดปฏิทินได้:", error);
      }
    }
  }, [verifiedFields.birthday]);

  // Cleanup URL เพื่อป้องกัน memory leak
  useEffect(() => {
    return () => {
      if (
        image &&
        image !== defaultAvatar &&
        image !== setting?.profile_picture_url
      ) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleEditClick = (field) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handlePasswordVerification = (isVerified) => {
    if (isVerified && currentField) {
      setVerifiedFields((prev) => ({ ...prev, [currentField]: true }));
      setEditFields((prev) => ({ ...prev, [currentField]: true }));
    }
    setIsModalOpen(false);
    setCurrentField(null);
  };

  const handleSave = async (field, value) => {
    try {
      setSetting((prevState) => ({
        ...prevState,
        [field]: value,
      }));

      const updatedData = new FormData();
      updatedData.append(field, value);

      const result = await updateUser(setting._id, updatedData);
      setSetting(result);

      setEditFields((prev) => ({ ...prev, [field]: false }));
      setVerifiedFields((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการอัปเดต ${field}:`, error);
      alert(`ไม่สามารถอัปเดต ${field} ได้ กรุณาลองใหม่อีกครั้ง`);
    }
  };

  const handleCancel = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: false }));
    setVerifiedFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleOpenCalendar = () => {
    if (birthdayInputRef.current) {
      try {
        birthdayInputRef.current.showPicker();
      } catch (error) {
        console.error("ไม่สามารถเปิดปฏิทินได้:", error);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setSetting((prev) => ({ ...prev, phone: value }));
    }
  };

  const handlePasswordChange = () => {
    if (
      passwordData.oldPassword &&
      passwordData.newPassword &&
      passwordData.confirmPassword
    ) {
      if (passwordData.newPassword === passwordData.confirmPassword) {
        console.log("รหัสผ่านเก่า:", passwordData.oldPassword);
        console.log("รหัสผ่านใหม่:", passwordData.newPassword);

        setSetting((prevState) => ({
          ...prevState,
          password: passwordData.newPassword,
        }));
        setIsPasswordChangeModalOpen(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      }
    } else {
      alert("กรุณากรอกรหัสผ่านให้ครบถ้วน");
    }
  };

  const handlePasswordModalClose = () => {
    setIsPasswordChangeModalOpen(false);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handlePasswordFieldChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = async (croppedArea, croppedAreaPixelsData) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  
    // สร้าง preview ของรูปภาพที่ถูก crop
    try {
      const image = new Image();
      image.src = tempImage;
  
      await new Promise((resolve) => {
        image.onload = resolve;
      });
  
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      canvas.width = croppedAreaPixelsData.width;
      canvas.height = croppedAreaPixelsData.height;
  
      ctx.beginPath();
      ctx.arc(
        croppedAreaPixelsData.width / 2,
        croppedAreaPixelsData.height / 2,
        Math.min(croppedAreaPixelsData.width, croppedAreaPixelsData.height) / 2,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.clip();
  
      ctx.drawImage(
        image,
        croppedAreaPixelsData.x,
        croppedAreaPixelsData.y,
        croppedAreaPixelsData.width,
        croppedAreaPixelsData.height,
        0,
        0,
        croppedAreaPixelsData.width,
        croppedAreaPixelsData.height
      );
  
      const previewUrl = canvas.toDataURL("image/jpeg", 0.8);
      setCroppedReview(previewUrl);
    } catch (error) {
      console.error("Error generating crop preview:", error);
    }
  };

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = tempImage;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.beginPath();
      ctx.arc(
        croppedAreaPixels.width / 2,
        croppedAreaPixels.height / 2,
        Math.min(croppedAreaPixels.width, croppedAreaPixels.height) / 2,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.8 // ลดคุณภาพเพื่อให้ขนาดเล็กลง
        );
      });

      const croppedFile = new File([croppedImage], "profile_picture_url.jpg", {
        type: "image/jpeg",
      });

      return { file: croppedFile, preview: URL.createObjectURL(croppedImage) };
    } catch (error) {
      console.error("Error creating cropped image:", error);
      alert("Error cropping image. Please try again.");
      return null;
    }
  };


  const applyCrop = async () => {
    const result = await createCroppedImage();
    if (result) {
      setIsUploading(true);
      try {
        console.log("Cropped file:", result.file);
        console.log("File name:", result.file.name);
        console.log("File size:", result.file.size);
        console.log("File type:", result.file.type);

        const formData = new FormData();
        formData.append("profile_picture_url", result.file);
        const updatedData = await updateUser(setting._id, formData);

        setSetting(updatedData);
        setImage(updatedData.profile_picture_url || defaultAvatar);

        setIsCropping(false);
        setTempImage(null);
        setIsUploading(false);
        console.log("Update Success");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปโหลดภาพ:", error);
        console.log("Response from server:", error.response?.data);
        console.log("Status code:", error.response?.status);
        const errorMessage = error.response?.data?.message || "Unknown error";
        alert(`ไม่สามารถอัปโหลดภาพได้: ${errorMessage}`);
        setIsUploading(false);
      }
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setTempImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <>
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none;
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div className="flex justify-center min-h-screen dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-4xl p-6 bg-card dark:bg-card rounded-lg shadow-md mt-10 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-text dark:text-text">
            Setting Information
          </h2>

          <div className="mb-6 flex justify-center">
            <div className="relative w-40 h-40 flex justify-center">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <ClipLoader size={40} color="#e11d48" />
                </div>
              ) : (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-rose-100 border "
                  onError={(e) => {
                    console.log("Failed to load image:", image);
                    e.target.src = defaultAvatar; // Fallback ถ้าโหลดไม่สำเร็จ
                  }}
                />
              )}
              <button
                onClick={handleEditImageClick}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full"
                disabled={isUploading}
              >
                <PencilSquareIcon className="h-6 w-6" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* ช่องชื่อ */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-text dark:text-text">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={setting?.username || ""}
                readOnly={!verifiedFields.username}
                onChange={(e) =>
                  setSetting((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
              />
              {!editFields.username && !verifiedFields.username && (
                <button
                  onClick={() => handleEditClick("username")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-text hover:scale-110 transition-transform"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
              {editFields.username && verifiedFields.username && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={() => handleSave("username", setting?.username)}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleCancel("username")}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ช่องอีเมล */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-text dark:text-text">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                name="email"
                value={setting?.email || ""}
                readOnly={!verifiedFields.email}
                onChange={(e) =>
                  setSetting((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
              />
              {!editFields.email && !verifiedFields.email && (
                <button
                  onClick={() => handleEditClick("email")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-text hover:scale-110 transition-transform"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
              {editFields.email && verifiedFields.email && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={() => handleSave("email", setting?.email)}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleCancel("email")}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ช่องโทรศัพท์ */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-text dark:text-text">
              Phone
            </label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={setting?.phone || ""}
                readOnly={!verifiedFields.phone}
                onChange={handlePhoneChange}
                maxLength={10}
                className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
              />
              {!editFields.phone && !verifiedFields.phone && (
                <button
                  onClick={() => handleEditClick("phone")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-text hover:scale-110 transition-transform"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
              {editFields.phone && verifiedFields.phone && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={() => handleSave("phone", setting?.phone)}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleCancel("phone")}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ช่องน้ำหนัก */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-text dark:text-text">
              Weight
            </label>
            <div className="relative">
              <input
                type="number"
                name="weight"
                value={setting?.weight || ""}
                readOnly={!verifiedFields.weight}
                onChange={(e) =>
                  setSetting((prev) => ({ ...prev, weight: e.target.value }))
                }
                className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
              />
              {!editFields.weight && !verifiedFields.weight && (
                <button
                  onClick={() => handleEditClick("weight")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-text hover:scale-110 transition-transform"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
              {editFields.weight && verifiedFields.weight && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={() => handleSave("weight", setting?.weight)}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleCancel("weight")}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ช่องวันเกิด */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-text dark:text-text">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                name="birthday"
                ref={birthdayInputRef}
                value={setting?.birthday || ""}
                readOnly={!verifiedFields.birthday}
                onChange={(e) =>
                  setSetting((prev) => ({ ...prev, birthday: e.target.value }))
                }
                className="w-full border border-border dark:border-border rounded-lg py-2 px-4 pr-16 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
              />
              {!editFields.birthday && !verifiedFields.birthday && (
                <button
                  onClick={() => handleEditClick("birthday")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-text hover:scale-110 transition-transform"
                >
                  <PencilSquareIcon className="h-6 w-6" />
                </button>
              )}
              {editFields.birthday && verifiedFields.birthday && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={handleOpenCalendar}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <CalendarIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleSave("birthday", setting?.birthday)}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleCancel("birthday")}
                    className="text-black dark:text-text p-2 rounded-md hover:scale-110 transition-transform"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* เปลี่ยนรหัสผ่าน */}
          <div className="mb-6 flex">
            <label className="block text-lg font-medium mb-2 text-text dark:text-text">
              Password
            </label>
            <div className="relative">
              <button
                onClick={() => setIsPasswordChangeModalOpen(true)}
                className="text-white dark:text-text p-2 rounded-md hover:scale-110 transition-transform bg-rose-600 ml-10"
              >
                change Password
              </button>
            </div>
          </div>
        </div>

        {/* Modal สำหรับการเปลี่ยนรหัสผ่าน */}
        {isPasswordChangeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-background p-6 rounded-lg w-96">
              <h2 className="text-xl text-black dark:text-text font-bold mb-4 text-center">
                Change Password
              </h2>
              <div className="mb-4">
                <label className="block text-sm text-black dark:text-text font-medium mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordFieldChange}
                  className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
                  placeholder="Old password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-black dark:text-text font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordFieldChange}
                  className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
                  placeholder="New Password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-black dark:text-text font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordFieldChange}
                  className="w-full border border-border dark:border-border rounded-lg py-2 px-4 focus:outline-none bg-background dark:bg-background text-text dark:text-text"
                  placeholder="Confirm New password"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePasswordModalClose}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* โมดัลสำหรับยืนยันรหัสผ่าน */}
        {isModalOpen && (
          <Authenticator
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onVerify={handlePasswordVerification}
            setIsLoading={setLoading}
          />
        )}

        {isCropping && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg w-[600px] h-[500px] flex flex-col">
              {/* Header */}
              <div className="p-4 text-white flex justify-between items-center border-b border-gray-700">
                <button
                  onClick={cancelCrop}
                  className="flex items-center text-rose-300 hover:text-rose-100"
                >
                  <ArrowLongLeftIcon className="mr-2" /> Back
                </button>
                <h4 className="text-lg font-medium">Crop Your Photo</h4>
                <div></div>
              </div>

              {/* Cropper Area */}
              <div className="flex-grow relative">
                <Cropper
                  image={tempImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{
                    containerStyle: { height: "100%", width: "100%" },
                    mediaStyle: { height: "100%", width: "100%" },
                  }}
                />
              </div>

              {/* Footer: Zoom Slider and Buttons */}
              <div className="p-4 border-t border-gray-700">
                <div className="mb-4">
                  <label className="text-white text-sm mb-1 block">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelCrop}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Setting;
