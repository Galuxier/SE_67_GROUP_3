import { useState, useEffect, useRef } from "react";
import { PlusCircleIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AddressForm from "../AddressForm";
import { updateGym } from "../../services/api/GymApi";

const EditGymModal = ({ isOpen, onClose, gymData, onSave }) => {
  const [editedGym, setEditedGym] = useState(gymData || {});
  const [existingImages, setExistingImages] = useState(gymData.gym_image_urls || []);
  const [newImages, setNewImages] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (gymData) {
      setEditedGym(gymData);
      setExistingImages(gymData.gym_image_urls || []);
    }
  }, [gymData]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      if (files.length + existingImages.length + newImages.length > 10) {
        alert("You can upload a maximum of 10 images.");
        return;
      }

      const previews = files.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => [...prev, ...previews]);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index, type) => {
    if (type === "existing") {
      const updatedImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedImages);
    } else {
      const updatedPreviews = filePreviews.filter((_, i) => i !== index);
      const updatedImages = newImages.filter((_, i) => i !== index);
      setFilePreviews(updatedPreviews);
      setNewImages(updatedImages);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const owner_id = user?._id;

  //     if (!owner_id) {
  //       throw new Error("User not found in localStorage");
  //     }

  //     const formData = new FormData();
  //     formData.append("owner_id", owner_id);
  //     formData.append("gym_name", editedGym.gym_name);
  //     formData.append("description", editedGym.description);
  //     formData.append("contact", JSON.stringify(editedGym.contact));
  //     formData.append("address", JSON.stringify(editedGym.address));

  //     newImages.forEach((file) => {
  //       formData.append("gym_images", file);
  //     });

  //     existingImages.forEach((url) => {
  //       formData.append("existing_images", url);
  //     });

  //     const response = await updateGym(editedGym._id, formData);
  //     console.log("Update Gym Successful:", response);

  //     onSave(response);
  //     onClose();
  //   } catch (error) {
  //     console.error("Update Gym Failed:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const owner_id = user?._id;
  
      if (!owner_id) {
        throw new Error("User not found in localStorage");
      }
  
      // สร้าง object ข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
      const updatedData = {
        owner_id,
        gym_name: editedGym.gym_name,
        description: editedGym.description,
        contact: editedGym.contact,
        address: editedGym.address,
        gym_image_urls: existingImages, // ส่งรูปภาพที่มีอยู่แล้ว
      };
  
      // เรียก API เพื่ออัปเดตข้อมูล
      const response = await updateGym(editedGym._id, updatedData);
      console.log("Update Gym Successful:", response);
  
      onSave(response);
      onClose();
    } catch (error) {
      console.error("Update Gym Failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] p-6 shadow-lg bg-white rounded-md overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Edit Gym</h2>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit}>
          {/* ชื่อโรงยิม */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              name="gym_name"
              value={editedGym.gym_name || ""}
              onChange={(e) => setEditedGym({ ...editedGym, gym_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* คำอธิบาย */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={editedGym.description || ""}
              onChange={(e) => setEditedGym({ ...editedGym, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
              rows="4"
              required
            />
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact</label>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedGym.contact?.email || ""}
                  onChange={(e) =>
                    setEditedGym({
                      ...editedGym,
                      contact: { ...editedGym.contact, email: e.target.value },
                    })
                  }
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
                  onChange={(e) =>
                    setEditedGym({
                      ...editedGym,
                      contact: { ...editedGym.contact, tel: e.target.value },
                    })
                  }
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Facebook:</label>
                <input
                  type="text"
                  name="facebook"
                  value={editedGym.contact?.facebook || ""}
                  onChange={(e) =>
                    setEditedGym({
                      ...editedGym,
                      contact: { ...editedGym.contact, facebook: e.target.value },
                    })
                  }
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  placeholder="(optional)"
                />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Line:</label>
                <input
                  type="text"
                  name="line"
                  value={editedGym.contact?.line || ""}
                  onChange={(e) =>
                    setEditedGym({
                      ...editedGym,
                      contact: { ...editedGym.contact, line: e.target.value },
                    })
                  }
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  placeholder="(optional)"
                />
              </div>
            </div>
          </div>

          <AddressForm
            initialData={editedGym.address}
            onChange={(newAddress) => {
              setEditedGym({ ...editedGym, address: newAddress });
            }}
          />

          {/* สิ่งอำนวยความสะดวก */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Facilities</label>
            <textarea
              name="facilities"
              value={editedGym.facilities || ""}
              onChange={(e) => setEditedGym({ ...editedGym, facilities: e.target.value })}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
              rows="2"
              placeholder="List gym facilities separated by commas"
            />
          </div>

          {/* อัปโหลดรูปภาพ */}
          <div className="mb-6">
            {/* <label className="block text-lg font-medium mb-2">Photos</label>
            <div className="relative w-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                id="fileInput"
                accept="image/*"
                multiple
              />
              <button
                className="w-full border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-between cursor-default"
              >
                <span className="text-gray-500 truncate pointer-events-none">
                  {filePreviews.length > 0 || existingImages.length > 0 ? "Files selected" : "Choose files"}
                </span>
                <PaperClipIcon
                  onClick={() => fileInputRef.current.click()}
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                />
              </button>
            </div> */}
            {/* แสดงรูปภาพที่มีอยู่แล้ว */}
            {/* <div className="mt-4 flex flex-wrap gap-2">
              {existingImages.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Existing ${index}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, "existing")}
                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div> */}
            {/* แสดงรูปภาพใหม่ */}
            {/* <div className="mt-4 flex flex-wrap gap-2">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, "new")}
                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div> */}
          </div>

          {/* ปุ่มบันทึก */}
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