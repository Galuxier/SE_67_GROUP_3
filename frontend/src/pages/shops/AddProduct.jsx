import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VariantModal from "../../components/shops/VariantModal";

export default function AddProduct() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hasOptions, setHasOptions] = useState(false);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [options, setOptions] = useState([]);
  const [image_url, setImageUrl] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const [newOption, setNewOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = image_url.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [image_url]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    if (fileArr.length + image_url.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }
    setImageUrl((prev) => [...prev, ...fileArr]);
  };

  const handleRemoveImage = (index) => {
    setImageUrl((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    setOptions((prev) => [...prev, { name: newOption, isMain: false }]);
    setNewOption("");
  };

  const setAsMainOption = (idx) => {
    setOptions((prev) =>
      prev.map((o, i) => ({ ...o, isMain: i === idx }))
    );
  };

  const handleNext = () => {
    if (!hasOptions) {
      const productObj = {
        product_name: productName,
        category,
        description,
        image_url, // array of Files
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
      };
      navigate("/shop/summary", { state: { product: productObj } });
    } else {
      setShowModal(true);
    }
  };

  const handleSubmitVariant = (newVariant) => {
    const updatedVariants = [...variants, newVariant];
    const productObj = {
      product_name: productName,
      category,
      description,
      image_url, // array of Files
      options,
      variants: updatedVariants,
    };
    setShowModal(false);
    navigate("/shop/summary", { state: { product: productObj } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Add Product</h1>

        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            className="border w-full p-3 rounded"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            className="border w-full p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            rows="3"
            className="border w-full p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Product Images</label>
          <div className="border-2 border-dashed rounded-lg p-2 text-center">
  {previewUrls.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
      {previewUrls.map((url, index) => (
        <div key={index} className="relative group w-20 h-20">
          <img
            src={url}
            alt={`Preview ${index}`}
            className="w-full h-full object-cover rounded border"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 p-0.5 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg hover:border-primary transition-colors"
      >
        <span className="text-xs">Add More</span>
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => fileInputRef.current.click()}
      className="flex flex-col items-center justify-center w-full py-6 hover:bg-gray-200 transition-colors"
    >
      <p className="text-sm">Click to upload images</p>
      <p className="text-xs">PNG, JPG up to 10 files</p>
    </button>
  )}
  <input
    type="file"
    multiple
    accept="image/*"
    ref={fileInputRef}
    onChange={handleImageChange}
    className="hidden"
  />
</div>

        </div>

        <div>
          <label className="block font-medium mb-1">Has Options?</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="hasOptions"
                onChange={() => {
                  setHasOptions(true);
                  setPrice("");
                  setStock("");
                }}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="hasOptions"
                onChange={() => {
                  setHasOptions(false);
                  setOptions([]);
                }}
              />
              No
            </label>
          </div>
        </div>

        {!hasOptions && (
          <div className="border p-4 rounded-lg">
            <div className="mb-4">
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                className="border w-full p-3 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Stock</label>
              <input
                type="number"
                className="border w-full p-3 rounded"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>
        )}

        {hasOptions && (
          <div className="border p-4 rounded-lg">
            <label className="block font-medium mb-2">Options</label>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="e.g. color, size"
                className="border p-2 flex-1 rounded"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <button
                onClick={addOption}
                className="bg-rose-600 text-white px-3 py-1 rounded"
              >
                +
              </button>
            </div>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <span className="text-lg">{opt.name}</span>
                <input
                  type="radio"
                  name="mainOption"
                  checked={opt.isMain}
                  onChange={() => setAsMainOption(idx)}
                />
                <span className="text-sm">Main Option</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          className="bg-rose-600 text-white px-4 py-2 rounded w-full"
        >
          Next
        </button>
      </div>

      <VariantModal
        show={showModal && hasOptions}
        onClose={() => setShowModal(false)}
        productOptions={options}
        onSubmitVariant={handleSubmitVariant}
      />
    </div>
  );
}
