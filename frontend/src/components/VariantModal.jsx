import { useState } from "react";

export default function VariantModal({
  show,
  onClose,
  productOptions,
  baseImage,
  onSubmitVariant
}) {
  const [tempVariant, setTempVariant] = useState({
    image_url: "",
    price: "",
    stock: "",
    attribute: {}
  });

  const handleVariantImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempVariant((prev) => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // ถ้าอยากบังคับรูป
    if (!tempVariant.image_url) {
      alert("Please upload a variant image!");
      return;
    }

    const newVar = {
      attribute: { ...tempVariant.attribute },
      image_url: tempVariant.image_url || baseImage,
      price: parseFloat(tempVariant.price) || 0,
      stock: parseInt(tempVariant.stock) || 0
    };

    onSubmitVariant(newVar); // ส่ง newVar กลับไปให้ parent (Summary.jsx)
  };

  if (!show) return null; // ไม่แสดงถ้า show=false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Variant</h2>

        <label className="block font-semibold mb-1">Upload Variant Image</label>
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-4"
          onChange={handleVariantImageUpload}
        />

        {/* วนลูปตัวเลือกจาก productOptions */}
        {productOptions.map((opt, index) => (
          <div key={index}>
            <label className="block font-semibold mb-2">{opt.name}</label>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              placeholder={`Enter ${opt.name}`}
              onChange={(e) => {
                setTempVariant((prev) => ({
                  ...prev,
                  attribute: { ...prev.attribute, [opt.name]: e.target.value }
                }));
              }}
            />
          </div>
        ))}

        <label className="block font-semibold mb-1">Price</label>
        <input
          type="number"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setTempVariant((prev) => ({ ...prev, price: e.target.value }))
          }
        />

        <label className="block font-semibold mb-1">Stock</label>
        <input
          type="number"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setTempVariant((prev) => ({ ...prev, stock: e.target.value }))
          }
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-pink-500 text-white py-2 px-4 rounded-lg"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}