import { useState } from "react";

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

          <h4 className="text-lg font-medium mb-2">Contact Info</h4>
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="email"
              name="email"
              value={formData.contacts.email}
              onChange={handleContactChange}
              placeholder="Email"
              className="p-2 border"
            />
            <input
              type="tel"
              name="tel"
              value={formData.contacts.tel}
              onChange={handleContactChange}
              placeholder="Tel"
              className="p-2 border"
            />
            <input
              type="text"
              name="line"
              value={formData.contacts.line}
              onChange={handleContactChange}
              placeholder="Line"
              className="p-2 border"
            />
            <input
              type="text"
              name="facebook"
              value={formData.contacts.facebook}
              onChange={handleContactChange}
              placeholder="Facebook"
              className="p-2 border"
            />
          </div>

          <h4 className="text-lg font-medium mb-2">Address</h4>
          <div className="space-y-2 mb-4">
            <input
              type="text"
              name="province"
              value={formData.address.province}
              onChange={handleAddressChange}
              placeholder="Province"
              className="p-2 border w-full"
            />
            <input
              type="text"
              name="district"
              value={formData.address.district}
              onChange={handleAddressChange}
              placeholder="District"
              className="p-2 border w-full"
            />
            <input
              type="text"
              name="subdistrict"
              value={formData.address.subdistrict}
              onChange={handleAddressChange}
              placeholder="Subdistrict"
              className="p-2 border w-full"
            />
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              placeholder="Street"
              className="p-2 border w-full"
            />
            <input
              type="text"
              name="postal_code"
              value={formData.address.postal_code}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              className="p-2 border w-full"
            />
            <input
              type="text"
              name="latitude"
              value={formData.address.latitude}
              onChange={handleAddressChange}
              placeholder="Latitude"
              className="p-2 border w-full"
            />
            <input
              type="text"
              name="longitude"
              value={formData.address.longitude}
              onChange={handleAddressChange}
              placeholder="Longitude"
              className="p-2 border w-full"
            />
          </div>

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
