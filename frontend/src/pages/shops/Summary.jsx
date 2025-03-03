import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import VariantModal from "../../components/shops/VariantModal";
import { creatProduct} from "../../services/api/ShopApi";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();



  // รับข้อมูล product จาก AddProduct
  const [product, setProduct] = useState(location.state?.product || {});
  console.log(product);
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async () => {
    try {
      const response = await creatProduct(product);
      console.log('Create Product Success: ', response);
      navigate("/shop");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleOpenModal = () => {
    if (!product.hasOptions) {
      alert("This product has no options!");
      return;
    }
    setShowModal(true);
  };

  const handleSubmitVariant = (newVar) => {
    const updatedProduct = {
      ...product,
      variants: [...(product.variants || []), newVar]
    };
    setProduct(updatedProduct);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
        <Link 
          to="/shop" 
          className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
        >
          ← Back
        </Link>

      <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">{product.product_name}</h2>

        {/* รูปหลักสินค้า */}
        {product.baseImage && (
          <div className="w-40 h-40 mx-auto mb-6">
            <img
              src={product.baseImage}
              alt="Product"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        <div className="mb-6">
          <p className="mb-2">
            <strong>Name:</strong> {product.name}
          </p>
          <p className="mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {product.description}
          </p>
        </div>

        <h3 className="text-xl font-bold mb-4">Variants</h3>
        <div className="space-y-4">
          {(product.variants || []).map((variant, index) => (
            <div key={index} className="border p-4 rounded flex gap-4 items-center">
              {variant.image_url && (
                <img
                  src={variant.image_url}
                  alt="Variant"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                {Object.entries(variant.attribute || {})
                  .filter(([_, val]) => val)
                  .map(([key, val]) => (
                    <p key={key} className="text-sm text-gray-700">
                      <strong>{key}:</strong> {val}
                    </p>
                  ))}
                <p className="text-sm text-gray-700">
                  <strong>Price:</strong> {variant.price} THB
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Stock:</strong> {variant.stock}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center gap-4 mt-6">
          {product.hasOptions && (
            <button
              onClick={handleOpenModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Variant
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 transition"
          >
            Sell
          </button>
        </div>
      </div>

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
