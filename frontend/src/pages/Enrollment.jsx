// frontend/src/pages/Enrollment.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitEnrollment } from "../services/api/UserApi";
import { XMarkIcon } from "@heroicons/react/24/solid";

function Enrollment() {
  const navigate = useNavigate();
  const { user, roles } = useAuth(); // รับ roles ที่ผู้ใช้มีอยู่แล้ว
  const [selectedRole, setSelectedRole] = useState("");
  const [licenseFiles, setLicenseFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [requestDescription, setRequestDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // รายการ role ทั้งหมดที่มีในระบบ
  const allRoles = [
    "gym_owner",
    "organizer",
    "shop_owner",
    "trainer",
    "boxer",
    "lessor"
  ];

  // กรอง roles ที่ผู้ใช้ยังไม่มี
  const availableRoles = allRoles.filter(role => !roles.includes(role));

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login", { state: { from: "/user/enrollment" } });
      return;
    }
    
    // ถ้าไม่มี role ที่สามารถสมัครได้ ให้แสดงข้อความและ redirect กลับ
    if (availableRoles.length === 0) {
      alert("You already have all available roles!");
      navigate(-1);
    }
  }, [user, navigate, availableRoles]);

  // Reset selected role if it's no longer available
  useEffect(() => {
    if (selectedRole && !availableRoles.includes(selectedRole)) {
      setSelectedRole("");
    }
  }, [selectedRole, availableRoles]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // ตรวจสอบจำนวนไฟล์ไม่เกิน 5 ไฟล์
      if (files.length + licenseFiles.length > 5) {
        setError("You can upload a maximum of 5 files.");
        return;
      }
      
      // สร้าง URL สำหรับแสดงตัวอย่างไฟล์
      const previews = files.map((file) => {
        // สำหรับรูปภาพ
        if (file.type.startsWith('image/')) {
          return { 
            url: URL.createObjectURL(file), 
            name: file.name, 
            size: file.size,
            type: 'image' 
          };
        } 
        // สำหรับไฟล์ PDF
        else if (file.type === 'application/pdf') {
          return { 
            url: null, 
            name: file.name, 
            size: file.size,
            type: 'pdf' 
          };
        }
        return null;
      }).filter(Boolean);
      
      setFilePreviews((prev) => [...prev, ...previews]);
      setLicenseFiles((prev) => [...prev, ...files]);
      setError("");
    }
  };

  const handleRemoveFile = (index) => {
    // ลบไฟล์และตัวอย่างไฟล์ตาม index
    const newFiles = [...licenseFiles];
    const newPreviews = [...filePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setLicenseFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handleDescriptionChange = (e) => {
    setRequestDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }
    
    if (licenseFiles.length === 0) {
      setError("Please upload at least one document");
      return;
    }
    
    if (!requestDescription) {
      setError("Please provide a description for your request");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create form data to send to the server
      
      const formData = new FormData();
      formData.append("user_id", user._id);
      formData.append("role", selectedRole);
      formData.append("description", requestDescription);
      
      // Add all license files
      licenseFiles.forEach((file) => {
        formData.append("license_ulrs", file);
      });
      
      // 🔥 อ่านค่าใน formData
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // Send to API
      const response = await submitEnrollment(formData);
      console.log(response);
      
      
      // Reset form after submission
      setSelectedRole("");
      setLicenseFiles([]);
      setFilePreviews([]);
      setRequestDescription("");
      
      // Navigate to confirmation page or home
      navigate("/", { state: { enrollmentSuccess: true } });
    } catch (error) {
      console.error("Error submitting enrollment request:", error);
      setError(error.message || "Failed to submit enrollment request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ถ้าไม่มี roles ที่สามารถสมัครได้ ไม่ต้องแสดงฟอร์ม
  if (availableRoles.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            &larr; Back
          </button>
          <h1 className="text-2xl font-bold text-center">Role Enrollment</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="" disabled>
                Choose a role
              </option>
              {availableRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role.replace("_", " ").replace(/\b\w/g, char => char.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* License Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Upload Licenses/Documents (PDF, JPG, JPEG, PNG)
            </label>
            <div className="relative w-full">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                multiple
              />
            </div>

            {/* แสดงตัวอย่างไฟล์ที่อัพโหลด */}
            {filePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative border border-gray-300 rounded-lg p-2 dark:border-gray-600">
                    {preview.type === 'image' ? (
                      <img
                        src={preview.url}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-500 dark:text-gray-300 mt-2">PDF</span>
                      </div>
                    )}
                    
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                      {preview.name} ({(preview.size / 1024).toFixed(2)} KB)
                    </div>
                    
                    {/* ปุ่มลบไฟล์ */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 text-white"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              * Maximum 5 files, each file should not exceed 5MB
            </p>
          </div>

          {/* Request Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Request Description
            </label>
            <textarea
              value={requestDescription}
              onChange={handleDescriptionChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="5"
              placeholder="Explain why you want to enroll for this role..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-gray-400" : "bg-rose-600 hover:bg-rose-700"
              } text-white px-6 py-2 rounded-md transition-colors duration-300`}
            >
              {isSubmitting ? "Submitting..." : "Submit Enrollment Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Enrollment;