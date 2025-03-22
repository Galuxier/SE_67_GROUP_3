import { useState, useEffect } from "react";

export default function VariantModal({ show, onClose, productOptions, onSubmitVariant }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [attribute, setAttribute] = useState({});

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleChangeAttr = (optName, value) => {
    setAttribute(prev => ({ ...prev, [optName]: value }));
  };

  const handleSubmit = () => {
    if (!imageFile) {
      alert("Please upload a variant image!");
      return;
    }
    const newVar = {
      image_url: imageFile,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      attribute,
    };
    onSubmitVariant(newVar);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">Add Variant</h2>
        <label className="block font-medium">Variant Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border w-full p-2 rounded"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Variant Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}
        {productOptions.map((opt, idx) => (
          <div key={idx}>
            <label className="block font-medium">{opt.name}</label>
            <input
              type="text"
              className="border w-full p-2 rounded"
              placeholder={`Enter ${opt.name}`}
              onChange={(e) => handleChangeAttr(opt.name, e.target.value)}
            />
          </div>
        ))}
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            className="border w-full p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="number"
            className="border w-full p-2 rounded"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-rose-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
