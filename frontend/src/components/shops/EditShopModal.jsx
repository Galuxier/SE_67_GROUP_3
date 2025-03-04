import { useState } from "react";
import AddressForm from "../AddressForm";

export default function EditShopModal({ show, onClose, shopData, onSave }) {
  const [formData, setFormData] = useState(() => ({
    shop_name: shopData?.shop_name || "",
    logo_url: shopData?.logo_url || "",
    description: shopData?.description || "",
    contacts: {
      email: shopData?.contacts?.email || "",
      tel: shopData?.contacts?.tel || "",
      line: shopData?.contacts?.line || "",
      facebook: shopData?.contacts?.facebook || "",
    },
    address: {
      province: shopData?.address?.province || "",
      district: shopData?.address?.district || "",
      subdistrict: shopData?.address?.subdistrict || "",
      street: shopData?.address?.street || "",
      postal_code: shopData?.address?.postal_code || "",
      latitude: shopData?.address?.latitude || "",
      longitude: shopData?.address?.longitude || "",
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, [name]: value },
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        logo_url: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave(formData);
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

        <div className="max-h-[80vh] overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">Edit Shop</h2>
          
          <label className="block font-semibold">Shop Name</label>
          <input
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            className="mb-4 p-2 w-full border"
          />

          <label className="block font-semibold">Shop Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 p-2 w-full border"
          />

          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mb-4 p-2 w-full border"
          />

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact</label>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.contacts.email}
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
                  value={formData.contacts.tel}
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
                  value={formData.contacts.line}
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
                  value={formData.contacts.facebook}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter Facebook (Optional)"
                />
              </div>
            </div>
          </div>

          <AddressForm/>

          <button
            onClick={handleSubmit}
            className="bg-rose-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
