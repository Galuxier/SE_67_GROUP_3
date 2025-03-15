// src/components/shops/EditShopModal.jsx
import { useState } from "react";
import AddressForm from "../AddressForm";
import CropImageModal from "./CropImageModal";
import { updateShop } from "../../services/api/ShopApi";

export default function EditShopModal({ show, onClose, shopData, onSave }) {
  const [formData, setFormData] = useState(() => ({
    shop_name: shopData.shop_name || "",
    description: shopData.description || "",
    contacts: { ...shopData.contacts },
    address: { ...shopData.address },
  }));

  const [logoFile, setLogoFile] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, [e.target.name]: e.target.value },
    }));
  };

  const handleAddressChange = (addr) => {
    setFormData((prev) => ({ ...prev, address: addr }));
  };

  const handleFileSelect = (e) => {
    if (!e.target.files[0]) return;
    setTempFile(e.target.files[0]);
    setShowCrop(true);
  };

  const handleCropDone = (croppedBlob) => {
    setLogoFile(croppedBlob);
    setShowCrop(false);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("shop_name", formData.shop_name);
      fd.append("description", formData.description);
      fd.append("contacts", JSON.stringify(formData.contacts));
      fd.append("address", JSON.stringify(formData.address));

      if (logoFile) fd.append("logo", logoFile);

      const updatedShop = await updateShop(shopData._id, fd);
      onSave(updatedShop);
      onClose();
    } catch (error) {
      alert("Failed to update shop!");
      console.error(error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Edit Shop</h2>

          <label className="block font-semibold">Shop Name</label>
          <input
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            className="mb-4 p-2 w-full border"
          />

          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mb-4 p-2 w-full border"
          />

          <label className="block font-semibold">Shop Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="mb-4 p-2 w-full border"
          />

          <label className="block text-lg font-medium mb-2">Contact</label>
          <div className="space-y-4 mb-4">
            <div>
              <span>Email:</span>
              <input
                type="email"
                name="email"
                value={formData.contacts.email}
                onChange={handleContactChange}
                className="border ml-2 px-2 py-1 w-60"
                required
              />
            </div>
            <div>
              <span>Tel:</span>
              <input
                type="tel"
                name="tel"
                value={formData.contacts.tel}
                onChange={handleContactChange}
                className="border ml-2 px-2 py-1 w-60"
                required
              />
            </div>
            <div>
              <span>Line:</span>
              <input
                type="text"
                name="line"
                value={formData.contacts.line}
                onChange={handleContactChange}
                className="border ml-2 px-2 py-1 w-60"
              />
            </div>
            <div>
              <span>Facebook:</span>
              <input
                type="text"
                name="facebook"
                value={formData.contacts.facebook}
                onChange={handleContactChange}
                className="border ml-2 px-2 py-1 w-60"
              />
            </div>
          </div>

          <AddressForm
            initialData={formData.address}
            onChange={handleAddressChange}
          />

          <button
            onClick={handleSubmit}
            className="bg-rose-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>

      <CropImageModal
        show={showCrop}
        onClose={() => setShowCrop(false)}
        file={tempFile}
        onCropDone={handleCropDone}
      />
    </div>
  );
}
