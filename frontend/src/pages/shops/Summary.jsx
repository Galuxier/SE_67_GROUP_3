import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || {});
  const [showModal, setShowModal] = useState(false);

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

  const handleAddVariant = () => {
    

    const newVar = {
      attribute: { ...tempVariant.attribute },
      image_url: tempVariant.image_url || product.baseImage,
      price: parseFloat(tempVariant.price) || 0,
      stock: parseInt(tempVariant.stock) || 0
    };

    setProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), newVar]
    }));
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        alert("Product added successfully!");
        navigate("/shop");
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold">Product Summary</h2>

      {product.baseImage && (
        <img
          src={product.baseImage}
          alt="Product"
          className="w-40 h-40 object-cover mb-4"
        />
      )}

      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <h3 className="mt-4 font-bold">Variants</h3>
      {(product.variants || []).map((variant, index) => (
        <div key={index} className="border p-2 mb-2">
          {variant.image_url && (
            <img
              src={variant.image_url}
              alt="Variant"
              className="w-20 h-20 object-cover mb-2"
            />
          )}

          {Object.entries(variant.attribute)
            .filter(([_, value]) => value)
            .map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}

          <p><strong>Price:</strong> {variant.price}</p>
          <p><strong>Stock:</strong> {variant.stock}</p>
        </div>
      ))}

      {product.hasOptions && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Variant
        </button>
      )}

      <button
        onClick={handleConfirm}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded ml-4"
      >
        Sell
      </button>

      {showModal && (
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

            {(product.options || []).map((opt, index) => (
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
              onChange={(e) => setTempVariant({ ...tempVariant, price: e.target.value })}
            />

            <label className="block font-semibold mb-1">Stock</label>
            <input
              type="number"
              className="border p-2 w-full mb-4"
              onChange={(e) => setTempVariant({ ...tempVariant, stock: e.target.value })}
            />

            <button
              onClick={handleAddVariant}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
