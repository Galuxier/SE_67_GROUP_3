import { useState } from "react";
import { Link } from "react-router-dom";

export default function AddShopForm() {
  const [formData, setFormData] = useState({
    shop_name: "",
    license: "",       // รูป license
    description: "",
    logo_url: "",      // รูปโปรไฟล์ร้าน
    contacts: "",
    address: {
      province: "",
      district: "",
      subdistrict: "",
      street: "",
      postal_code: "",
      latitude: "",
      longitude: "",
      information: ""
    }
  });

  // ฟังก์ชันอัปเดตฟิลด์ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ฟังก์ชันอัปเดตฟิลด์ address
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
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
        [field]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // ฟังก์ชัน Submit → POST ไป Backend ตรง ๆ
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      alert("Shop created successfully!");
      console.log("Server response:", result);
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
        <Link to="/shop" className="text-blue-500">← Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Add Shop</h2>

        {/* Shop Name */}
        <label className="block font-semibold">Shop Name</label>
        <input
          name="shop_name"
          onChange={handleChange}
          className="mb-4 p-2 w-full border"
          required
        />

        {/* License (รูป) */}
        <label className="block font-semibold">License</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "license")}
          className="mb-4 p-2 w-full border"
        />

        {/* Description */}
        <label className="block font-semibold">Description</label>
        <input
          name="description"
          onChange={handleChange}
          className="mb-4 p-2 w-full border"
          required
        />

        {/* Shop Profile (logo) */}
        <label className="block font-semibold">Shop Profile</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "logo_url")}
          className="mb-4 p-2 w-full border"
        />

        {/* Contacts */}
        <label className="block font-semibold">Contacts</label>
        <input
          name="contacts"
          onChange={handleChange}
          className="mb-4 p-2 w-full border"
          required
        />

        {/* Location */}
        <h3 className="text-xl font-bold mb-2">Location</h3>

        <label className="block font-semibold">Province</label>
        <input
          name="province"
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">District</label>
        <input
          name="district"
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Subdistrict</label>
        <input
          name="subdistrict"
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Street</label>
        <input
          name="street"
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Postal Code</label>
        <input
          name="postal_code"
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Latitude</label>
        <input
          name="latitude"
          onChange={handleAddressChange}
          className="mb-4 p-2 w-full border"
        />

        <label className="block font-semibold">Longitude</label>
        <input
          name="longitude"
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
          className="w-full bg-pink-500 text-white py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
