import { useState } from "react";
import { Link } from "react-router-dom";
import { registerShop } from '../../services/api/ShopApi';

export default function AddShopForm() {
  const [formData, setFormData] = useState({
    shop_name: "",
    license: "", // รูป license
    description: "",
    logo_url: "", // รูปโปรไฟล์ร้าน
    contacts: {
      email: "",
      tel: "",
      line: "",
      facebook: "",
    },
    address: {
      province: "",
      district: "",
      subdistrict: "",
      street: "",
      postal_code: "",
      latitude: "",
      longitude: "",
      information: "",
    },
  });

  // ฟังก์ชันอัปเดตฟิลด์ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ฟังก์ชันอัปเดตฟิลด์ contacts
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value,
      },
    }));
  };

  // ฟังก์ชันอัปเดตฟิลด์ address
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // ฟังก์ชันอัปโหลดรูป (license หรือ logo_url)
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ฟังก์ชัน Submit → POST ไป Backend ตรง ๆ
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const owner_id = user?._id;

      if (!owner_id) {
        throw new Error("User not found in localStorage");
      }

      const shopData = {
        owner_id,
        shop_name: formData.shop_name,
        license: formData.license,
        description: formData.description,
        logo_url: formData.logo_url,
        contacts: formData.contacts,
        address: formData.address
      };

      const response = await registerShop(shopData);

      alert("Shop created successfully!");
      console.log("Server response:", response);
      // สามารถ redirect ไปหน้า /shop หรือหน้าอื่นตามต้องการ
    } catch (error) {
      console.error("Error creating shop:", error);
      alert("Failed to create shop!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* ปุ่ม Back to Home */}
      <div className="absolute top-4 left-4">
        <Link 
          to="/shop" 
          className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
        >
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Shop Register</h2>

        {/* Shop Name */}
        <label className="block font-semibold">Shop Name</label>
        <input
          name="shop_name"
          value={formData.shop_name}
          onChange={handleChange}
          className="mb-4 p-2 w-full border"
          required
        />

        {/* Shop Profile (logo) */}
        <label className="block font-semibold">Shop Profile (Logo)</label>
        <input
          type="file"
          accept="image/*"  
          onChange={(e) => handleFileChange(e, "logo_url")}
          className="mb-4 p-2 w-full border"
        />

        {/* Description */}
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mb-4 p-2 w-full border"
          required
        />

        {/* Contacts */}
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

        {/* License (รูป) */}
        <label className="block font-semibold">License</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "license")}
          className="mb-4 p-2 w-full border"
        />

        {/* Location */}
        <h3 className="text-xl font-bold mb-2">Location</h3>

        <label className="block font-semibold">Province</label>
        <input
          name="province"
          value={formData.address.province}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">District</label>
        <input
          name="district"
          value={formData.address.district}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Subdistrict</label>
        <input
          name="subdistrict"
          value={formData.address.subdistrict}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Street</label>
        <input
          name="street"
          value={formData.address.street}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Postal Code</label>
        <input
          name="postal_code"
          value={formData.address.postal_code}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Latitude</label>
        <input
          name="latitude"
          value={formData.address.latitude}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Longitude</label>
        <input
          name="longitude"
          value={formData.address.longitude}
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${formData.address.latitude},${formData.address.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-500 underline text-center mb-4"
        >
          View on Google Maps
        </a>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}