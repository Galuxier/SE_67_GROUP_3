import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdsPackage } from "../../services/api/AdsPackageApi";
import { CurrencyDollarIcon, CalendarIcon } from "@heroicons/react/24/outline";

function AddPackage() {
  const [packageData, setPackageData] = useState({
    type: "course",
    name: "",
    detail: "",
    duration: 30,
    price: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", packageData.type);
      formData.append("name", packageData.name);
      formData.append("detail", packageData.detail);
      formData.append("duration", packageData.duration.toString());
      formData.append("price", packageData.price.toString());
      formData.append("status", "active");

      const createdPackage = await createAdsPackage(formData);
      console.log("Package created successfully:", createdPackage);
      alert(`Package "${packageData.name}" created successfully!`);
      navigate("/some-success-page"); // เปลี่ยนไปยังหน้าที่ต้องการหลังสำเร็จ
    } catch (error) {
      console.error("Error creating package:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background pt-10 pb-10">
      <div className="w-full max-w-2xl p-8 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-text">Create New Ads Package</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Type */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Package Type
            </label>
            <select
              name="type"
              value={packageData.type}
              onChange={handleInputChange}
              className="w-full p-2 border border-border rounded bg-card text-text focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="course">Course</option>
              <option value="event">Event</option>
            </select>
          </div>

          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Package Name
            </label>
            <input
              type="text"
              name="name"
              value={packageData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-border rounded bg-card text-text focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
              placeholder="Enter package name"
              required
            />
          </div>

          {/* Package Detail */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Package Details
            </label>
            <textarea
              name="detail"
              value={packageData.detail}
              onChange={handleInputChange}
              className="w-full p-2 border border-border rounded bg-card text-text focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
              placeholder="Enter package details"
              rows={3}
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Duration (days)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="duration"
                value={packageData.duration}
                onChange={handleInputChange}
                className="w-full pl-8 p-2 border border-border rounded bg-card text-text focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Price (THB)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="price"
                value={packageData.price}
                onChange={handleInputChange}
                className="w-full pl-8 p-2 border border-border rounded bg-card text-text focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPackage;