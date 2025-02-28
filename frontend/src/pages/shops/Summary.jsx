import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import VariantModal from "../../components/VariantModal";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูล product จาก AddProduct
  const [product, setProduct] = useState(location.state?.product || {});

  // คุม Modal
  const [showModal, setShowModal] = useState(false);

  // เมื่อกด Sell -> POST ไป API
  const handleConfirm = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        alert("Product added successfully!");
        navigate("/shop"); // ไปหน้า shop หรือหน้าอื่น
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // เมื่อกด Add Variant -> เปิด Modal
  const handleOpenModal = () => {
    // ถ้าต้องการเช็ค hasOptions
    if (!product.hasOptions) {
      alert("This product has no options!");
      return;
    }
    setShowModal(true);
  };

  // เมื่อกด Submit ใน VariantModal
  const handleSubmitVariant = (newVar) => {
    // เพิ่ม variant ใหม่ใน product
    const updatedProduct = {
      ...product,
      variants: [...(product.variants || []), newVar]
    };
    setProduct(updatedProduct);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* ปุ่มกลับ หรืออื่น ๆ */}
      <div className="absolute top-4 left-4">
        <Link to="/shop" className="text-blue-500">
          ← Back
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Product Summary</h2>

      {/* รูปหลัก */}
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
          {/* แสดง attribute */}
          {Object.entries(variant.attribute || {})
            .filter(([_, val]) => val)
            .map(([key, val]) => (
              <p key={key}>
                <strong>{key}:</strong> {val}
              </p>
            ))}
          <p><strong>Price:</strong> {variant.price}</p>
          <p><strong>Stock:</strong> {variant.stock}</p>
        </div>
      ))}

      {/* ถ้า user เลือก hasOptions => ให้ add Variant ได้ */}
      {product.hasOptions && (
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Variant
        </button>
      )}

      <button
        onClick={handleConfirm}
        className="bg-pink-500 text-white px-4 py-2 rounded ml-4"
      >
        Sell
      </button>

      {/* เรียกใช้ VariantModal อีกครั้ง */}
      <VariantModal
        show={showModal}
        onClose={() => setShowModal(false)}
        productOptions={product.options || []}
        baseImage={product.baseImage}
        onSubmitVariant={handleSubmitVariant}
      />
    </div>
  );
}
