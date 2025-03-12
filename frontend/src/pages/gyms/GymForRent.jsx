import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaperClipIcon } from "@heroicons/react/24/outline";
function GymForRent() {
  const nevigate = useNavigate();
  const [gymForRentData, setGymForRentData] = useState({
    gym_name: "",
    price: "",
    gym_image_url: [],
    gym_siteplan_url: null,
  });

  const fileInputRefGymImage = useRef(null);
  const fileInputRefSitePlan = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGymForRentData({ ...gymForRentData, [name]: value });
  };

  const handleImageUpload = (e, fieldName) => {
    const files = Array.from(e.target.files);

    if (fieldName === "gym_image_url") {
      setGymForRentData({
        ...gymForRentData,
        gym_image_url: files,
      });
    } else if (fieldName === "gym_siteplan_url") {
      setGymForRentData({
        ...gymForRentData,
        gym_siteplan_url: files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gymForRentData.gym_name || !gymForRentData.price) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Form Data:", gymForRentData);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...gymForRentData.gym_image_url];
    updatedImages.splice(index, 1);
    setGymForRentData({ ...gymForRentData, gym_image_url: updatedImages });
  };

  const Back = () => {
    nevigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={Back}
            className="text-gray-500 hover:text-gray-700 text-lg font-semibold"
          >
            &larr; Back
          </button>
          <h1 className="text-lg font-semibold text-center flex-grow">
            For Rent
          </h1>
        </div>
        <hr className="mb-4" />

        {/* ชื่อ */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="gym_name"
            value={gymForRentData.gym_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* รูปภาพ */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Gym Image
          </label>
          <div className="relative w-full flex items-center">
            <input
              ref={fileInputRefGymImage}
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e, "gym_image_url")}
              className="hidden"
              accept="image/*"
              required
            />
            <button
              className="w-full border  rounded-lg py-2 px-4 flex justify-between items-center cursor-default"
            >
              <PaperClipIcon 
                onClick={() => fileInputRefGymImage.current.click()}
                className="h-6 w-6 cursor-pointer text-gray-600 ml-auto" 
              />
            </button>
          </div>
          {/* แสดงรูปภาพที่เลือก */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {gymForRentData.gym_image_url.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`gym_image_${index}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                ></button>
              </div>
            ))}
          </div>
        </div>

        {/* รูปภาพ แปลน */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Site Plan
          </label>
          <div className="relative w-full flex items-center">
            <input
              ref={fileInputRefSitePlan}
              type="file"
              onChange={(e) => handleImageUpload(e, "gym_siteplan_url")}
              className="hidden"
              accept="image/*"
              required
            />
            <button className="w-full border rounded-lg py-2 px-4 flex justify-between items-center cursor-default">
              <PaperClipIcon
                onClick={() => fileInputRefSitePlan.current.click()}
                className="h-6 w-6 cursor-pointer text-gray-600 ml-auto"
              />
            </button>
          </div>
          
          {gymForRentData.gym_siteplan_url && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(gymForRentData.gym_siteplan_url)}
                alt="Site Plan"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* ราคา */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={gymForRentData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
            required
          />
        </div>

        {/* ปุ่มส่งฟอร์ม */}
        <button
          type="submit"
          className="w-full bg-rose-600 text-white font-semibold py-2 rounded-lg hover:bg-rose-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default GymForRent;
