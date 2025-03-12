import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VariantModal from "../../components/shops/VariantModal";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    baseImage: "",
    hasOptions: false,
    price: "",
    stock: "",
    options: [],
    variants: [],
  });

  const [newOption, setNewOption] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleBaseImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, baseImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, { name: newOption, isMain: false, values: [] }],
    }));
    setNewOption("");
  };

  const setAsMainOption = (index) => {
    setProduct((prev) => {
      const updatedOptions = prev.options.map((opt, i) => ({
        ...opt,
        isMain: i === index,
      }));
      return { ...prev, options: updatedOptions };
    });
  };

  const openModal = () => {
    if (!product.hasOptions) {
      const mainVariant = {
        attribute: {},
        image_url: product.baseImage,
        price: parseFloat(product.price) || 0,
        stock: parseInt(product.stock) || 0,
      };
      const updatedProduct = {
        ...product,
        variants: [mainVariant],
      };
      navigate("/shop/summary", { state: { product: updatedProduct } });
      return;
    }
    setShowModal(true);
  };

  const handleSubmitVariant = (newVar) => {
    const updatedProduct = {
      ...product,
      variants: [...product.variants, newVar],
    };
    setShowModal(false);
    navigate("/shop/summary", { state: { product: updatedProduct } });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 pb-10">
      <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md overflow-y-auto">
        {/* ส่วนหัว */}
        <div className="flex justify-between items-center mb-4">
        <button
        onClick={() => navigate(-1)}
        className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
      >
        Back
      </button>
          <h1 className="text-3xl font-semibold py-2">Add Product</h1>
          <div className="w-20"></div>
        </div>
        <hr className="mb-6" />

        {/* ฟอร์ม */}
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Category</label>
            <input
              type="text"
              placeholder="Enter product category"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              rows="4"
              placeholder="Enter product description"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none"
              onChange={handleBaseImageUpload}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Product Options</label>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="hasOptions"
                  onChange={() => setProduct({ ...product, hasOptions: true })}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="hasOptions"
                  onChange={() =>
                    setProduct({
                      ...product,
                      hasOptions: false,
                      options: [],
                      price: "",
                      stock: "",
                    })
                  }
                />
                No
              </label>
            </div>

            {!product.hasOptions && (
              <div className="border border-gray-300 p-3 rounded-lg space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-2">Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                  />
                </div>
              </div>
            )}

            {product.hasOptions && (
              <div className="border border-gray-300 p-3 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-lg font-medium">Add Option:</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:border-pink-500"
                    placeholder="e.g. Size, Color"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                  <button
                    onClick={addOption}
                    className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                {product.options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <p>{opt.name}</p>
                    <input
                      type="radio"
                      name="mainOption"
                      checked={opt.isMain}
                      onChange={() => setAsMainOption(index)}
                    />
                    <span className="text-sm">Main Option</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={openModal}
            className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <VariantModal
        show={showModal && product.hasOptions}
        onClose={() => setShowModal(false)}
        productOptions={product.options}
        baseImage={product.baseImage}
        onSubmitVariant={(newVar) => handleSubmitVariant(newVar)}
      />
    </div>
  );
}
